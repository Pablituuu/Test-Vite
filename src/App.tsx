import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import {
  Canvas,
  useActiveObject,
  useActiveScene,
  useEditor,
} from "@layerhub-pro/react";
import { groupBy } from "lodash";
import { HexColorPicker } from "react-colorful";

const resource = {
  id: "res_1501",
  name: "0WBKAMFPLl",
  license: "free",
  visibility: "public",
  category: "IMAGE",
  created_at: 1669092647,
  updated_at: 1669092647,
  url: "https://ik.imagekit.io/jwzv5rwz9/resources/svg/res_559.svg",
  preview: "https://ik.imagekit.io/jwzv5rwz9/resources/svg/res_559.svg",
  tags: [
    "corona",
    "kiss",
    "lockdown",
    "quarantine",
    "social distancing",
    "coronavirus",
    "marriage",
    "bride",
    "groom",
    "wedding",
    "quarantaine",
    "confinement",
  ],
  colors: [],
  drawifier: {
    id: "draw_7",
    name: "Kristof Braekeleire",
    avatar: "https://ik.imagekit.io/jwzv5rwz9/uploads/draw_7_avatar.jpg",
  },
};

function App() {
  const editor = useEditor();
  const activeScene = useActiveScene();
  const [state, setState] = React.useState<any>({ colorMap: {} });
  const vectorPaths = React.useRef<any>({});
  const activeObject = useActiveObject() as any;

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticVector") {
      const objects = activeObject._objects[0]._objects;
      const objectColors = groupBy(objects, "fill");
      vectorPaths.current = objectColors;
      setState({ ...state, colorMap: activeObject.colorMap });
    }
  }, [activeObject]);

  const changeBackgroundColor = (prev: string, next: string) => {
    console.log(activeObject.colorMap);
    const objectRef = activeObject;
    objectRef.updateLayerColor(prev, next);
    setState({
      ...state,
      colorMap: {
        ...state.colorMap,
        [prev]: next,
      },
    });
  };

  const addObject = () => {
    try {
      const options = {
        type: "StaticVector",
        name: "Shape",
        src: resource.url,
        ...{
          watermark:
            resource.license === "paid" &&
            "https://ik.imagekit.io/scenify/drawify-small.svg",
        },
        metadata: {},
      };
      if (editor) {
        activeScene.objects.add(options);
      }
    } catch {}
  };

  return (
    <Flex>
      <Button bg="blue" onClick={addObject}>
        boton
      </Button>
      <Box style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {Object.keys(state.colorMap).map((c, index) => {
          return (
            <Popover key={index}>
              <PopoverTrigger>
                <div
                  style={{
                    height: "24px",
                    width: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: state.colorMap[c],
                    border: "1px solid #dedede",
                  }}
                ></div>
              </PopoverTrigger>
              <PopoverContent>
                <HexColorPicker
                  onChange={(color) => {
                    changeBackgroundColor(c, color);
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        })}
      </Box>
      <Flex flex={1} h="100vh" w="100vw">
        <Canvas
          config={{
            outsideVisible: true,
            margin: 50,
          }}
        />
      </Flex>
    </Flex>
  );
}

export default App;
