using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Community.DominantColourPicker.Composing
{
    [DataEditor(
    alias: "dominantColourPicker",
    name: "Dominant Colour Picker",
    view: $"/App_Plugins/{DominantColourPickerConstants.PluginAlias}/backoffice/dominant-colour-picker/dominantColourPicker.html",
    ValueType = ValueTypes.Json,
    Group = "Pickers",
    Icon = "icon-colorpicker")]
    public class DominantColourPickerPropertyEditor : DataEditor
    {
        private readonly IIOHelper _ioHelper;
        private readonly IEditorConfigurationParser _editorConfigurationParser;

        public DominantColourPickerPropertyEditor(
            IDataValueEditorFactory dataValueEditorFactory,
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser)
            : base(dataValueEditorFactory)
        {
            _ioHelper = ioHelper;
            _editorConfigurationParser = editorConfigurationParser;
        }

        protected override IConfigurationEditor CreateConfigurationEditor()
        {
            return new DominantColourPickerConfigurationEditor(_editorConfigurationParser, _ioHelper);
        }
    }
}