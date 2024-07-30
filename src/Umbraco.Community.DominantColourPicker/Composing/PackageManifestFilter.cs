namespace Umbraco.Community.DominantColourPicker.Composing;

using Umbraco.Cms.Core.Manifest;

internal sealed class PackageManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        manifests.Add(new PackageManifest
        {            
            PackageName = DominantColourPickerConstants.PackageAlias,
            Scripts = new[] {
                $"/App_Plugins/{DominantColourPickerConstants.PluginAlias}/backoffice/dominant-colour-picker/assets/color-thief.umd.js",
                $"/App_Plugins/{DominantColourPickerConstants.PluginAlias}/backoffice/dominant-colour-picker/dominantColourPicker.controller.js"
            },
            Version = typeof(PackageManifestFilter)?.Assembly?.GetName()?.Version?.ToString(3) ?? string.Empty,
            AllowPackageTelemetry = true
        });
    }
}