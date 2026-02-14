export type DemoResult = {
  id: string;
  inputUrl: string;
  outputUrls: {
    bbox: string;
    gradcam: string;
    zoomed: string;
  };
  label: string;
  defectId: string;
  confidence: number;
};

export const DEMO_RESULTS: Record<string, DemoResult> = {
  img01: {
    id: "img01",
    inputUrl: "/demo/inputs/Sample1_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample1_bbox.png",
      gradcam: "/demo/outputs/Sample1_gradcam.png",
      zoomed: "/demo/outputs/Sample1_zoomed.png",
    },
    label: "Open Circuit",
    defectId: "D-OC-01",
    confidence: 0.93,
  },
  img02: {
    id: "img02",
    inputUrl: "/demo/inputs/Sample2_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample2_bbox.png",
      gradcam: "/demo/outputs/Sample2_gradcam.png",
      zoomed: "/demo/outputs/Sample2_zoomed.png",
    },
    label: "Short Circuit",
    defectId: "D-SC-02",
    confidence: 0.91,
  },
  img03: {
    id: "img03",
    inputUrl: "/demo/inputs/Sample3_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample3_bbox.png",
      gradcam: "/demo/outputs/Sample3_gradcam.png",
      zoomed: "/demo/outputs/Sample3_zoomed.png",
    },
    label: "Mouse Bite",
    defectId: "D-MB-03",
    confidence: 0.89,
  },
  img04: {
    id: "img04",
    inputUrl: "/demo/inputs/Sample4_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample4_bbox.png",
      gradcam: "/demo/outputs/Sample4_gradcam.png",
      zoomed: "/demo/outputs/Sample4_zoomed.png",
    },
    label: "Spur",
    defectId: "D-SP-04",
    confidence: 0.87,
  },
  img05: {
    id: "img05",
    inputUrl: "/demo/inputs/Sample5_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample5_bbox.png",
      gradcam: "/demo/outputs/Sample5_gradcam.png",
      zoomed: "/demo/outputs/Sample5_zoomed.png",
    },
    label: "Copper Residue",
    defectId: "D-CR-05",
    confidence: 0.90,
  },
  img06: {
    id: "img06",
    inputUrl: "/demo/inputs/Sample6_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample6_bbox.png",
      gradcam: "/demo/outputs/Sample6_gradcam.png",
      zoomed: "/demo/outputs/Sample6_zoomed.png",
    },
    label: "Pin Hole",
    defectId: "D-PH-06",
    confidence: 0.88,
  },
  img07: {
    id: "img07",
    inputUrl: "/demo/inputs/Sample7_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample7_bbox.png",
      gradcam: "/demo/outputs/Sample7_gradcam.png",
      zoomed: "/demo/outputs/Sample7_zoomed.png",
    },
    label: "Open Circuit",
    defectId: "D-OC-07",
    confidence: 0.94,
  },
  img08: {
    id: "img08",
    inputUrl: "/demo/inputs/Sample8_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample8_bbox.png",
      gradcam: "/demo/outputs/Sample8_gradcam.png",
      zoomed: "/demo/outputs/Sample8_zoomed.png",
    },
    label: "Short Circuit",
    defectId: "D-SC-08",
    confidence: 0.92,
  },
  img09: {
    id: "img09",
    inputUrl: "/demo/inputs/Sample9_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample9_bbox.png",
      gradcam: "/demo/outputs/Sample9_gradcam.png",
      zoomed: "/demo/outputs/Sample9_zoomed.png",
    },
    label: "Mouse Bite",
    defectId: "D-MB-09",
    confidence: 0.86,
  },
  img10: {
    id: "img10",
    inputUrl: "/demo/inputs/Sample10_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample10_bbox.png",
      gradcam: "/demo/outputs/Sample10_gradcam.png",
      zoomed: "/demo/outputs/Sample10_zoomed.png",
    },
    label: "Spur",
    defectId: "D-SP-10",
    confidence: 0.85,
  },
  img11: {
    id: "img11",
    inputUrl: "/demo/inputs/Sample11_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample11_bbox.png",
      gradcam: "/demo/outputs/Sample11_gradcam.png",
      zoomed: "/demo/outputs/Sample11_zoomed.png",
    },
    label: "Copper Residue",
    defectId: "D-CR-11",
    confidence: 0.91,
  },
  img12: {
    id: "img12",
    inputUrl: "/demo/inputs/Sample12_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample12_bbox.png",
      gradcam: "/demo/outputs/Sample12_gradcam.png",
      zoomed: "/demo/outputs/Sample12_zoomed.png",
    },
    label: "Pin Hole",
    defectId: "D-PH-12",
    confidence: 0.88,
  },
  img13: {
    id: "img13",
    inputUrl: "/demo/inputs/Sample13_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample13_bbox.png",
      gradcam: "/demo/outputs/Sample13_gradcam.png",
      zoomed: "/demo/outputs/Sample13_zoomed.png",
    },
    label: "Open Circuit",
    defectId: "D-OC-13",
    confidence: 0.95,
  },
  img14: {
    id: "img14",
    inputUrl: "/demo/inputs/Sample14_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample14_bbox.png",
      gradcam: "/demo/outputs/Sample14_gradcam.png",
      zoomed: "/demo/outputs/Sample14_zoomed.png",
    },
    label: "Short Circuit",
    defectId: "D-SC-14",
    confidence: 0.93,
  },
  img15: {
    id: "img15",
    inputUrl: "/demo/inputs/Sample15_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample15_bbox.png",
      gradcam: "/demo/outputs/Sample15_gradcam.png",
      zoomed: "/demo/outputs/Sample15_zoomed.png",
    },
    label: "Mouse Bite",
    defectId: "D-MB-15",
    confidence: 0.87,
  },
  img16: {
    id: "img16",
    inputUrl: "/demo/inputs/Sample16_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample16_bbox.png",
      gradcam: "/demo/outputs/Sample16_gradcam.png",
      zoomed: "/demo/outputs/Sample16_zoomed.png",
    },
    label: "Spur",
    defectId: "D-SP-16",
    confidence: 0.86,
  },
  img17: {
    id: "img17",
    inputUrl: "/demo/inputs/Sample17_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample17_bbox.png",
      gradcam: "/demo/outputs/Sample17_gradcam.png",
      zoomed: "/demo/outputs/Sample17_zoomed.png",
    },
    label: "Copper Residue",
    defectId: "D-CR-17",
    confidence: 0.92,
  },
  img18: {
    id: "img18",
    inputUrl: "/demo/inputs/Sample18_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample18_bbox.png",
      gradcam: "/demo/outputs/Sample18_gradcam.png",
      zoomed: "/demo/outputs/Sample18_zoomed.png",
    },
    label: "Pin Hole",
    defectId: "D-PH-18",
    confidence: 0.89,
  },
  img19: {
    id: "img19",
    inputUrl: "/demo/inputs/Sample19_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample19_bbox.png",
      gradcam: "/demo/outputs/Sample19_gradcam.png",
      zoomed: "/demo/outputs/Sample19_zoomed.png",
    },
    label: "Open Circuit",
    defectId: "D-OC-19",
    confidence: 0.94,
  },
  img20: {
    id: "img20",
    inputUrl: "/demo/inputs/Sample20_original.png",
    outputUrls: {
      bbox: "/demo/outputs/Sample20_bbox.png",
      gradcam: "/demo/outputs/Sample20_gradcam.png",
      zoomed: "/demo/outputs/Sample20_zoomed.png",
    },
    label: "Short Circuit",
    defectId: "D-SC-20",
    confidence: 0.92,
  },
};