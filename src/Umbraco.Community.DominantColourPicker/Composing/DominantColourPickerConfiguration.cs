using Umbraco.Cms.Core.PropertyEditors;

namespace Umbraco.Community.DominantColourPicker.Composing
{
    public class DominantColourPickerConfiguration
    {
        public DominantColourPickerConfiguration()
        {
            TintColour = "#000000";
        }

        [ConfigurationField("imageAlias", "Image Alias", "textstring", Description = "Property alias of image to use.")]
        public string ImageAlias { get; set; }

        [ConfigurationField("tintSliderAlias", "Tint Slider Alias", "textstring", Description = "Property alias of an optional tint silider to use to tint the background image.")]
        public string TintSliderAlias { get; set; }

        [ConfigurationField("tintColour", "Tint Colour", "textstring", Description = "Tint colour to use to darken the colour picked from the image.")]
        public string TintColour { get; set; }

        [ConfigurationField("enableTint", "Enable Tint", "boolean", Description = "Enable a tint to darken the colour picked from the image.")]
        public bool EnableTint { get; set; }
    }
}