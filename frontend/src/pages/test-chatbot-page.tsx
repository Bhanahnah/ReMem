import React from "react";
import {
  WebChatContainer,
  setEnableDebug,
  WebChatConfig,
} from "@ibm-watson/assistant-web-chat-react";

const webChatOptions: WebChatConfig = {
  integrationID: "c783320d-572e-4f91-a009-7b4db38968ed",
  region: "us-south",
  serviceInstanceID: "11a6895d-e806-4e3e-a2e8-97bd95e35312",
  // subscriptionID: 'only on enterprise plans',
  // Note that there is no onLoad property here. The WebChatContainer component will override it.
  // Use the onBeforeRender or onAfterRender prop instead.
};

// Include this if you want to get debugging information from this library. Note this is different than
// the web chat "debug: true" configuration option which enables debugging within web chat.
setEnableDebug(true);

export const ChatbotPage: React.FC = () => {
  return (
    <div className="content-layout">
      <h1 id="page-title" className="content__title">
        ReMem project consultation bot
      </h1>
      <div className="content__body">
        <WebChatContainer config={webChatOptions} />
      </div>
    </div>
  );
};
