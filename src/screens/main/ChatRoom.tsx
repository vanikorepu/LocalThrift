import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import { RootStackScreenProps, MessageType } from '../../types';
import { COLOR, CLICK_COLOR, FONT } from '../../settings';
import { GetMessages } from '../../api/api';

const SERVER_URL = 'http://localhost:3000';

function ChatRoomPage({ navigation, route }: RootStackScreenProps<'ChatRoom'>): JSX.Element {
  const { room_id, other_name, product_brand } = route.params;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: other_name,
      headerBackTitleVisible: false,
    });

    const init = async () => {
      const id = await AsyncStorage.getItem('user_id') ?? '';
      setUserId(id);

      // Load message history
      const history = await GetMessages(room_id);
      setMessages(history || []);

      // Connect socket
      const socket = io(SERVER_URL, { transports: ['websocket'] });
      socketRef.current = socket;

      socket.emit('join_room', room_id);

      socket.on('new_message', (msg: MessageType) => {
        setMessages(prev => [...prev, msg]);
      });
    };

    init();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit('send_message', {
      room_id,
      sender_id: userId,
      text: text.trim(),
    });
    setText('');
  };

  const renderMessage = ({ item }: { item: MessageType }) => {
    const isMe = item.sender_id === userId;
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowOther]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {product_brand ? (
        <View style={styles.productBanner}>
          <Text style={styles.productBannerText}>About: {product_brand}</Text>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor="#aaa"
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!text.trim()}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  productBanner: {
    backgroundColor: COLOR,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  productBannerText: { color: 'white', fontSize: 12, fontFamily: FONT },
  messageList: { paddingHorizontal: 12, paddingVertical: 8, paddingBottom: 80 },
  msgRow: { marginVertical: 3, flexDirection: 'row' },
  msgRowMe: { justifyContent: 'flex-end' },
  msgRowOther: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: COLOR,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextMe: { color: 'white' },
  bubbleTextOther: { color: '#111' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
    marginRight: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#ccc' },
  sendBtnText: { color: 'white', fontSize: 18, fontWeight: '700' },
});

export default ChatRoomPage;
