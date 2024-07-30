using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.DominantColourPicker.Composing
{
    public class DominantColourPickerConfigurationEditor : ConfigurationEditor<DominantColourPickerConfiguration>
    {
        public DominantColourPickerConfigurationEditor(IEditorConfigurationParser configurationParser, IIOHelper ioHelper)
            : base(ioHelper,configurationParser)
        {
        }
    }
}