using Umbraco.Cms.Core.PropertyEditors;

namespace Umbraco.Community.DominantColourPicker.Composing
{
    public class DominantColourPickerConfiguration
    {
        [ConfigurationField("imageAlias", "Image Alias", "textstring", Description = "Property alias of image to use")]
        public string ImageAlias { get; set; }

        [ConfigurationField("tintSliderAlias", "Tint Slider Alias", "textstring", Description = "Property alias of an optional tint silider to use to tint the background image")]
        public string TintSliderAlias { get; set; }
    }
}