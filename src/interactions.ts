import ResizeObserver from 'resize-observer-polyfill';
import Measure from './widgets/Measure';
import esri = __esri;

interface InteractionParameters {
  layerListContainer: HTMLElement;
  legendContainer: HTMLElement;
  measure: Measure;
  widgetPanel: any;
  view: esri.MapView | esri.SceneView;
}

export function interactions({
  layerListContainer,
  legendContainer,
  measure,
  basemapGallery,
  widgetPanel,
  view
}: InteractionParameters) {
  // toggle widgets
  const actions = Array.from(document.querySelectorAll('calcite-action'));
  const widgetList = [
    {
      label: 'Layers',
      container: layerListContainer
    },
    {
      label: 'Legend',
      container: legendContainer
    },
    {
      label: 'Measure',
      container: measure.container
    },
    {
      label: 'Basemap',
      container: basemapGallery.container
    }
  ];
  for (const action of actions) {
    action.addEventListener('click', () => {
      const actionText = (action as any).text;
      widgetList.forEach(w => {
        actionText == w.label ? w.container.classList.toggle('hidden') : w.container.classList.add('hidden');
      });
      if (actionText != 'Measure') {
        measure.disable();
      } else {
        measure.enable();
      }
      widgetPanel.collapsed =
        widgetList.filter(w => {
          return !w.container.classList.contains('hidden');
        }).length == 0;
    });
  }

  // listen for widget panel to be to be resized
  const rObserver = new ResizeObserver(() => {
    view.padding = {
      ...view.padding,
      left: widgetPanel.offsetWidth
    };
  });

  rObserver.observe(widgetPanel);
  return rObserver;
}
