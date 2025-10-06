"use client";

import ProgressBar from "@/components/progress-bar";
import { encryptText } from "@/app/game/actions";
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

declare global {
  interface Window {
    OnGameOverJSON?: (score: number) => void;
  }
}

export default function ProtectedPage() {
  const {
    unityProvider,
    sendMessage,
    addEventListener,
    removeEventListener,
    isLoaded,
    loadingProgression,
  } = useUnityContext({
    loaderUrl: "/Build/MoonRabbitRush.loader.js",
    dataUrl: "/Build/MoonRabbitRush.data",
    frameworkUrl: "/Build/MoonRabbitRush.framework.js",
    codeUrl: "/Build/MoonRabbitRush.wasm",
  });

  useEffect(() => {
    const onMsg = async (e: MessageEvent) => {
      if (e.data?.type === "GAME_OVER_JSON") {
        const data = JSON.parse(e.data.payload);
        const score = Number(data.score);
        console.log(score + "asdkflhasjklfh");

        const encryptedScore = encryptText(score.toString());
        await fetch(`/api/game/score`, {
          method: "POST",
          body: JSON.stringify({
            score: encryptedScore,
          }),
        });
      }
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

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
