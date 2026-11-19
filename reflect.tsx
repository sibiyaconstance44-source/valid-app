import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { askReflectionAI } from '@/lib/llm';
import type { ChatMessage } from '@/types';

const MOCK_REPLIES = [
  "There's a heaviness in what you just shared — something that has been carried for a while. When that feeling sits with you, where in your body do you notice it most clearly?",
  "It sounds like part of you has learned to stay quiet about this. What is the version of this story you have never fully spoken out loud, even to yourself?",
  "You described the situation carefully, almost from a distance. If the tight place in your chest had its own voice right now, what would it be trying to protect you from?",
  "There is a sense of unfinished business in what you said. Which relationship or moment still feels heavy with something left unsaid?",
  "You mentioned trying to manage this alone. What messages did you absorb growing up about what you were allowed to need from others?",
];

function callMockAI(turn: number): string {
  return MOCK_REPLIES[turn % MOCK_REPLIES.length];
}

export default function ReflectScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        "This is a quiet space. There is no advice here — only room to notice what is true for you right now.\n\nWhat is currently taking up the most space in your mind that you have been carrying alone?",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const turnRef = useRef(0);
  const listRef = useRef<FlatList>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const reply = await askReflectionAI(history);
      setUsingMock(false);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      // Graceful fallback to mock when no key or network error
      const reply = callMockAI(turnRef.current);
      turnRef.current += 1;
      setUsingMock(true);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (e.message !== 'NO_API_KEY') {
        // Only alert on real errors, not missing key
        console.warn('LLM fallback:', e.message);
      }
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {usingMock && (
          <View style={styles.mockBanner}>
            <Text style={styles.mockText}>
              Offline mode — add an API key in Settings for a live model.
            </Text>
          </View>
        )}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.role === 'user' ? styles.userText : styles.assistantText,
                ]}
              >
                {item.content}
              </Text>
            </View>
          )}
        />

        {loading && (
          <View style={styles.typing}>
            <ActivityIndicator size="small" color="#5B6B4F" />
            <Text style={styles.typingText}>…</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Share whatever feels true…"
            placeholderTextColor="#A0A0A0"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendDisabled]}
            onPress={send}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F5F2' },
  mockBanner: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE69C',
  },
  mockText: { fontSize: 12, color: '#664D03', textAlign: 'center' },
  list: { padding: 16, paddingBottom: 12 },
  bubble: {
    maxWidth: '88%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#5B6B4F',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8E2DB',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#fff' },
  assistantText: { color: '#2C2C2C' },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  typingText: { color: '#8A8A8A' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E2DB',
    backgroundColor: '#fff',
    gap: 10,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
    color: '#2C2C2C',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  sendBtn: {
    backgroundColor: '#5B6B4F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendDisabled: { opacity: 0.4 },
  sendText: { color: '#fff', fontWeight: '600' },
});
