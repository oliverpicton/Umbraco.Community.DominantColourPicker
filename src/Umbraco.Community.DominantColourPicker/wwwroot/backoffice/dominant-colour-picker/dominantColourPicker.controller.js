angular.module("umbraco")
    .controller("Umbraco.Community.DominantColourPickerController", function ($scope, $timeout, assetsService, editorState, mediaResource, mediaHelper, eventsService) {
        $scope.palette = [];
        $scope.tintPercentage = $scope.model.config.tintPercentage || 50;

        let initialMediaKey = null;

        function fetchMedia(mediaPicker) {
            console.log('Fetching media');
            if (mediaPicker && mediaPicker.value && mediaPicker.value.length > 0) {
                var imageId = mediaPicker.value[0].mediaKey;

                mediaResource.getById(imageId).then(function (media) {
                    $scope.media = media;
                    $scope.imagePath = mediaHelper.resolveFile(media, false);
                    $scope.showImage = true;
                    initializeColorPicker($scope.imagePath, $scope);
                });
            } else {
                $scope.imagePath = "";
                $scope.media = null;
                $scope.showImage = false;
            }
        }

        function findPropertyByAlias(variants, propertyAlias) {
            for (let variant of variants) {
                for (let tab of variant.tabs) {
                    for (let property of tab.properties) {
                        if (property.alias === propertyAlias) {
                            return { property, variant };
                        }
                    }
                }
            }
            return null;
        }

        function initializeMediaKey() {
            var mediaPickerInfo = findPropertyByAlias(editorState.current.variants, imageAlias);
            if (mediaPickerInfo && mediaPickerInfo.property.value && mediaPickerInfo.property.value.length > 0) {
                initialMediaKey = mediaPickerInfo.property.value[0].mediaKey;
                console.log('Initial Media Key:', initialMediaKey);
                fetchMedia(mediaPickerInfo.property); // Ensure fetchMedia is called on initial load
            }
        }

        var unsubscribeOpen = eventsService.on("appState.editors.open", function (event, args) {
            console.log("An editor is opened:", args);
            if (args.editorState && args.editorState.content) {
                console.log("Editor State:", args.editorState.content);
            }
        });

        const imageAlias = $scope.model.config.imageAlias;
        const sliderAlias = $scope.model.config.tintSliderAlias;

        // Initialize the initialMediaKey and fetch media when the controller is loaded
        $timeout(initializeMediaKey, 0);

        $scope.$watch(function () {
            return editorState.current.variants;
        }, function (newVal, oldVal) {
            if (newVal !== oldVal) {
                var mediaPickerInfo = findPropertyByAlias(editorState.current.variants, imageAlias);
                if (mediaPickerInfo && mediaPickerInfo.property.value && mediaPickerInfo.property.value.length > 0) {
                    var currentMediaKey = mediaPickerInfo.property.value[0].mediaKey;
                    if (currentMediaKey !== initialMediaKey) {
                        fetchMedia(mediaPickerInfo.property);
                        initialMediaKey = currentMediaKey; // Update the initialMediaKey to the new value
                    }
                }

                var sliderInfo = findPropertyByAlias(editorState.current.variants, sliderAlias);
                if (sliderInfo) {
                    var sliderValue = sliderInfo.property.value;
                    if (sliderValue !== $scope.tintPercentage) {
                        $scope.tintPercentage = sliderValue;

                        var tintedPalette = $scope.palette.map(color => {
                            var tintedColor = applyTint(color, $scope.tintPercentage);
                            return { value: rgbToHex(...tintedColor) };
                        });

                        // Use $timeout to ensure this runs outside of the current digest cycle
                        $timeout(function () {
                            $scope.model.items = tintedPalette;
                        });
                    }
                }
            }
        }, true);

        function rgbToHex(r, g, b) {
            return "#" + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }).join("");
        }

        function applyTint(rgbColor, tintPercentage) {
            const white = [0, 0, 0];
            return rgbColor.map((colorValue, index) => {
                return Math.round(colorValue * (1 - tintPercentage / 100) + white[index] * (tintPercentage / 100));
            });
        }

        function initializeColorPicker(imagePath, $scope) {
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imagePath;

            img.onload = function () {
                var colorThief = new ColorThief();
                $scope.palette = colorThief.getPalette(img);

                var tintedPalette = $scope.palette.map(color => {
                    var tintedColor = applyTint(color, $scope.tintPercentage);
                    return { value: rgbToHex(...tintedColor) };
                });

                $timeout(function () {
                    $scope.model.items = tintedPalette;
                });
            };
        }

        assetsService
            .load([
                "/App_Plugins/DominantColourPicker/backoffice/dominant-colour-picker/assets/color-thief.umd.js"
            ]);
    });