import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import Avatar from './Avatar';
import { Colors, Gradients } from '../constants/colors';
import { Text as TextStyles, Spacing } from '../constants/text';

const DEMO_THREADS = [
  {
    name: 'Teacher Amina Yusuf', role: 'Class teacher · Grade 5 - A', unread: 2,
    messages: [
      { from: 'them', text: 'Asc, Yusuf did really well in today\'s math quiz — 18/20!', time: '9:14 AM' },
      { from: 'me', text: 'Mahadsanid macalin! Waan ku faraxsanahay 🎉', time: '9:20 AM' },
      { from: 'them', text: 'Could you make sure he brings his geometry set tomorrow?', time: '9:22 AM' },
    ],
  },
  {
    name: 'Teacher Sahra Maxamed', role: 'Science teacher', unread: 0,
    messages: [
      { from: 'them', text: 'Reminder: the science fair project is due next Thursday.', time: 'Yesterday' },
    ],
  },
  {
    name: 'School Office', role: 'School admin', unread: 1,
    messages: [
      { from: 'them', text: 'This month\'s fee statement has been posted to your account.', time: 'Mon' },
    ],
  },
];

function ThreadListItem({ thread, active, onPress }) {
  const last = thread.messages[thread.messages.length - 1];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.threadItem, active && styles.threadItemActive, pressed && { opacity: 0.85 }]}>
      <Avatar name={thread.name} size={42} gradient={Gradients.brand} />
      <View style={{ flex: 1 }}>
        <Text style={[TextStyles.body, { fontWeight: '700' }]} numberOfLines={1}>{thread.name}</Text>
        <Text style={[TextStyles.caption, { color: Colors.muted }]} numberOfLines={1}>{last?.text}</Text>
      </View>
      {thread.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{thread.unread}</Text>
        </View>
      )}
    </Pressable>
  );
}

function Bubble({ message }) {
  const mine = message.from === 'me';
  return (
    <View style={[styles.bubbleRow, mine && { justifyContent: 'flex-end' }]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[TextStyles.body, mine && { color: '#fff' }]}>{message.text}</Text>
        <Text style={[styles.bubbleTime, mine && { color: 'rgba(255,255,255,0.7)' }]}>{message.time}</Text>
      </View>
    </View>
  );
}

// Two-pane (desktop) / stacked (mobile) messaging mock — chat list +
// thread, with a clear "school-monitored" safety notice up top, matching
// the Phase 2 spec for student/parent ↔ teacher communication.
export default function MessagingSection({ threads = DEMO_THREADS, recipientHint }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();
  const isDesktop = width > 860;
  const active = threads[activeIndex];

  const list = (
    <View style={[styles.listPane, isDesktop && styles.listPaneDesktop]}>
      <Text style={[TextStyles.h2, { marginBottom: 10 }]}>Conversations</Text>
      {threads.map((thread, i) => (
        <ThreadListItem key={i} thread={thread} active={i === activeIndex} onPress={() => setActiveIndex(i)} />
      ))}
    </View>
  );

  const thread = (
    <AppCard style={[styles.threadPane, { flex: 1 }]} padded={false}>
      <View style={styles.threadHeader}>
        <Avatar name={active.name} size={40} gradient={Gradients.brand} />
        <View style={{ flex: 1 }}>
          <Text style={[TextStyles.body, { fontWeight: '700' }]}>{active.name}</Text>
          <Text style={[TextStyles.caption, { color: Colors.muted }]}>{active.role}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.bubbles}>
        {active.messages.map((m, i) => <Bubble key={i} message={m} />)}
      </ScrollView>
      <View style={styles.composer}>
        <View style={styles.input}>
          <Text style={{ color: Colors.muted }}>{recipientHint || 'Write a message…'}</Text>
        </View>
        <Pressable style={styles.sendBtn}>
          <Ionicons name="send" size={16} color="#fff" />
        </Pressable>
      </View>
    </AppCard>
  );

  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 4 }}>
        <Text style={TextStyles.h1}>Messages</Text>
        <Text style={TextStyles.bodyMuted}>Talk directly with your child's teachers — every conversation here is school-monitored for safety.</Text>
      </View>

      <AppCard style={styles.noticeCard}>
        <Ionicons name="shield-checkmark-outline" size={16} color={Colors.success} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          For everyone's safety, messages sent through Kobciye are visible to school administration. Teachers can only reply to students/parents from their assigned classes.
        </Text>
      </AppCard>

      <View style={[styles.body, isDesktop && styles.bodyDesktop]}>
        {list}
        {thread}
      </View>

      <AppCard style={styles.placeholderNote}>
        <Ionicons name="construct-outline" size={16} color={Colors.muted} />
        <Text style={[TextStyles.caption, { color: Colors.muted, flex: 1 }]}>
          Placeholder conversations — sending, push notifications and unread counts go live with the messaging backend.
        </Text>
      </AppCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.md, paddingBottom: Spacing.xl },
  noticeCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: `${Colors.success}0D` },
  body: { gap: 14 },
  bodyDesktop: { flexDirection: 'row', alignItems: 'flex-start' },
  listPane: { gap: 6 },
  listPaneDesktop: { width: 280 },
  threadItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14 },
  threadItemActive: { backgroundColor: `${Colors.primary}0D` },
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  threadPane: { minHeight: 380, overflow: 'hidden' },
  threadHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  bubbles: { padding: 16, gap: 10 },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '78%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  bubbleTheirs: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, borderTopLeftRadius: 4 },
  bubbleMine: { backgroundColor: Colors.primary, borderTopRightRadius: 4 },
  bubbleTime: { fontSize: 10, color: Colors.muted, alignSelf: 'flex-end' },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: Colors.background },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  placeholderNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
});
