function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

angular.module("umbraco")
    .controller("Umbraco.Community.DominantColourPickerController", function ($scope, $timeout, assetsService, editorState, mediaResource, mediaHelper) {
        var vm = this;

        vm.selectColor = function (color) {
            $timeout(function () {
                var newColor = color ? color.value : null;
                vm.modelValueForm.selectedColor.$setViewValue(newColor);
            });
        };

        $scope.model.items = [];
        $scope.model.config.useLabel = true;

        $scope.getPropertyValueByAlias = function (myAlias) {
            if (!editorState.current) {
                return null;
            }

            let allProps = [];
            if (editorState.current.variants) {
                editorState.current.variants.forEach(variant => {
                    variant.tabs.forEach(tab => {
                        allProps = allProps.concat(tab.properties);
                    });
                });
            } else if (editorState.current.tabs) {
                editorState.current.tabs.forEach(tab => {
                    allProps = allProps.concat(tab.properties);
                });
            }

            const property = allProps.find(prop => prop.alias === myAlias);
            return property ? property.value : null;
        };

        $scope.$watch(function () {
            return editorState.current;
        }, function (newVal) {
            if (newVal) {
                $scope.initialize();
            }
        });

        $scope.initialize = function () {
            $scope.imageAlias = $scope.model.config.imageAlias;
            $scope.imagePath = "";
            $scope.media = null;
            $scope.showImage = false;

            const imagePropValue = $scope.getPropertyValueByAlias($scope.imageAlias);

            if (imagePropValue) {
                mediaResource.getById(imagePropValue[0].mediaKey).then(function (media) {
                    $scope.media = media;
                    $scope.imagePath = mediaHelper.resolveFile(media, false);
                    $scope.showImage = true;
                    initializeColorPicker($scope.imagePath, $scope);
                });
            }
        };

        assetsService
            .load([
                "/App_Plugins/DominantColourPicker/backoffice/dominant-colour-picker/assets/color-thief.umd.js"
            ])
            .then(function () {
                if (editorState.current) {
                    $scope.initialize();
                }
            });
    });

function initializeColorPicker(imagePath, $scope) {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imagePath;

    img.onload = function () {
        var colorThief = new ColorThief();

        var palette = colorThief.getPalette(img);

        var hexPalette = palette.map(function (color) {
            return { value: rgbToHex(color[0], color[1], color[2]) };
        });

        $scope.$apply(function () {
            $scope.model.items = hexPalette;
        });
    };
}