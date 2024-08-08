angular.module("umbraco")
    .controller("Umbraco.Community.DominantColourPickerController", function ($scope, $timeout, editorState, mediaResource, mediaHelper, eventsService, editorService) {
        $scope.palette = [];
        $scope.tintPercentage = $scope.model.config.tintPercentage || 50;
        $scope.tintColour = hexToRgb($scope.model.config.tintColour || "#000000");
        $scope.enableTint = $scope.model.config.enableTint || false;

        let initialMediaKey = null;

        function fetchMedia(mediaPicker) {
            if (mediaPicker && mediaPicker.value && mediaPicker.value.length > 0) {
                var imageId = mediaPicker.value[0].mediaKey;

                mediaResource.getById(imageId).then(function (media) {
                    $scope.media = media;
                    $scope.imagePath = mediaHelper.resolveFile(media, false);
                    $scope.showImage = true;
                    initializeColorPicker($scope.imagePath, $scope);
                });
            } else {
                $scope.imagePath = '';
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

                        if (property.editor === "Umbraco.BlockList" && property.value?.contentData) {
                            for (let block of property.value.contentData) {
                                if (block[propertyAlias] != null) {                               
                                    return { property: { value: block[propertyAlias] }, variant };
                                }
                            }
                        }
                    }
                }
            }
            return null;
        }

        function initialize(content, imageAlias) {
            var mediaPickerInfo = findPropertyByAlias(content, imageAlias);

            if (mediaPickerInfo && mediaPickerInfo.property.value && mediaPickerInfo.property.value.length > 0) {

                initialMediaKey = mediaPickerInfo.property.value[0].mediaKey;

                fetchMedia(mediaPickerInfo.property);
            }
        }

        function updateTintedPalette(tintPercentage, tintColour) {
            $scope.tintPercentage = tintPercentage;
            $scope.tintColour = tintColour;

            if ($scope.enableTint) {
                var tintedPalette = $scope.palette.map(color => {
                    var tintedColor = applyTint(color, tintPercentage, tintColour);
                    return { value: rgbToHex(...tintedColor) };
                });

                $timeout(function () {
                    $scope.model.items = tintedPalette;
                });
            } else {
                $scope.model.items = $scope.palette.map(color => ({ value: rgbToHex(...color) }));
            }
        }

        const imageAlias = $scope.model.config.imageAlias;
        const sliderAlias = $scope.model.config.tintSliderAlias;
        
        $timeout(initialize(editorState.current.variants, imageAlias), 0);

        $scope.$watch(function () {
            return editorState.current.variants;
        }, function (newVal, oldVal) {            
            if (newVal !== oldVal) {
                var mediaPickerInfo = findPropertyByAlias(editorState.current.variants, imageAlias);
                if (mediaPickerInfo && mediaPickerInfo.property.value && mediaPickerInfo.property.value.length > 0) {
                    var currentMediaKey = mediaPickerInfo.property.value[0].mediaKey;
                    if (currentMediaKey !== initialMediaKey) {
                        fetchMedia(mediaPickerInfo.property);
                        initialMediaKey = currentMediaKey;
                    }
                }

                var sliderInfo = findPropertyByAlias(editorState.current.variants, sliderAlias);
                if (sliderInfo) {
                    var sliderValue = sliderInfo.property.value;
                    if (sliderValue !== $scope.tintPercentage) {
                        updateTintedPalette(sliderValue, $scope.tintColour);
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

        function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if (hex.length === 3) {
                hex = hex.split('').map(h => h + h).join('');
            }
            const int = parseInt(hex, 16);
            return [int >> 16, (int >> 8) & 255, int & 255];
        }

        function applyTint(rgbColor, tintPercentage, tintColour) {
            return rgbColor.map((colorValue, index) => {
                return Math.round(colorValue * (1 - tintPercentage / 100) + tintColour[index] * (tintPercentage / 100));
            });
        }

        function initializeColorPicker(imagePath, $scope) {
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imagePath;

            img.onload = function () {
                var colorThief = new ColorThief();
                $scope.palette = colorThief.getPalette(img);

                updateTintedPalette($scope.tintPercentage, $scope.tintColour);
            };
        }
    });