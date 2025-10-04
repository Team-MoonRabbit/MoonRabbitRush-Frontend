"use client";

import ProgressBar from "@/components/progress-bar";
import { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

declare global {
  interface Window {
    receiveFromUnity?: (message: string) => void;
  }
}

export default function ProtectedPage() {
  const {
    unityProvider,
    sendMessage,
    // addEventListener,
    // removeEventListener,
    isLoaded,
    loadingProgression,
  } = useUnityContext({
    loaderUrl: "/Build/MoonRabbitRush.loader.js",
    dataUrl: "/Build/MoonRabbitRush.data",
    frameworkUrl: "/Build/MoonRabbitRush.framework.js",
    codeUrl: "/Build/MoonRabbitRush.wasm",
  });

  useEffect(() => {
    window.receiveFromUnity = (message: string) => {
      console.log(message);
    };

    return () => {
      delete window.receiveFromUnity;
    };
  }, []);

  useEffect(() => {
    sendMessage(
      "UnityToReactTest",
      "ReceiveFromReact",
      "eyasdfasfa.fdsfa.fda.daf"
    );
  }, [sendMessage]);

  return (
    <div className="w-full h-full grid relative">
      {!isLoaded && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ProgressBar
            percentage={Number((loadingProgression * 100).toFixed(0))}
          />
        </div>
      )}
      <Unity
        style={{
          width: "100%",
          height: "100%",
          justifySelf: "center",
          alignSelf: "center",
        }}
        unityProvider={unityProvider}
      />
    </div>
  );
}
