import getResponse from "./src/api";
import { DotIndicator } from "react-native-indicators";
import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import { SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";

const logo = require("./assets/logo.jpeg");

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    welcomeMessage();
  }, []);

  const welcomeMessage = () => {
    setMessages([
      {
        _id: new Date().toString(),
        text: "Hello 😊 How Can I help you?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "OPENAI GPT",
          avatar: logo,
        },
      },
    ]);
  };

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      const value = messages[0].text;
      try {
        const response = await getResponse(value, isImage);
        setLoading(false);
        if (response) {
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [response])
          );
        }
      } catch (error) {
        setLoading(false);
      }
    },
    [isImage]
  );

  const renderBubble = (props: object) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: styles.left,
          right: styles.right,
        }}
      />
    );
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={{ marginLeft: -220 }}>
          <DotIndicator color="#007aff" size={10} style={{ margin: 10 }} />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>{isImage ? "Image search" : "Text search"}</Text>
        <Switch value={isImage} onValueChange={() => setIsImage(!isImage)} />
      </View>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderFooter={renderFooter}
        onSend={(messages) => {
          onSend(messages);
          setLoading(true);
        }}
        user={{
          _id: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  right: {
    marginRight: 0,
    marginLeft: 60,
    borderRadius: 10,
    backgroundColor: "#007aff",
  },
  left: {
    marginLeft: 0,
    marginRight: 60,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
});
