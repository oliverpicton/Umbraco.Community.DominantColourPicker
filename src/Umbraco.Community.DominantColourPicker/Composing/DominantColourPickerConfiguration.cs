using Umbraco.Cms.Core.PropertyEditors;

namespace Umbraco.Community.DominantColourPicker.Composing
{
    public class DominantColourPickerConfiguration
    {
        [ConfigurationField("imageAlias", "Image Alias", "textstring", Description = "Property alias of image to use")]
        public string ImageAlias { get; set; }
    }
}