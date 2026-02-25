import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TouchableOpacity, FlatList, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenProps, RoomType } from '../../types';
import { COLOR, CLICK_COLOR, FONT } from '../../settings';
import { GetRooms, GetImage } from '../../api/api';

function ChatListPage({ navigation }: TabScreenProps<'Messages'>): JSX.Element {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [load, setLoad] = useState(false);

  const fetchRooms = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    if (!user_id) return;
    const data = await GetRooms(user_id);
    setRooms(data || []);
    setLoad(true);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const renderItem = ({ item }: { item: RoomType }) => (
    <TouchableOpacity
      style={styles.roomRow}
      onPress={() =>
        navigation.navigate('ChatRoom', {
          room_id: item.id,
          other_name: item.other_name,
          product_brand: item.product_brand,
        })
      }>
      {item.product_images && item.product_images.length > 0 ? (
        <Image
          source={{ uri: GetImage(item.product_images[0].name) }}
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarText}>
            {item.other_name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.roomInfo}>
        <Text style={styles.otherName}>{item.other_name}</Text>
        <Text style={styles.productBrand}>{item.product_brand}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message || 'No messages yet'}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  if (!load) return <View style={styles.loading} />;

  if (rooms.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💬</Text>
        <Text style={styles.emptyTitle}>No conversations yet</Text>
        <Text style={styles.emptySub}>
          Message a seller from a product listing to start chatting
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: 'white' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontFamily: FONT, color: COLOR, marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  avatarFallback: { backgroundColor: COLOR, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontSize: 22, fontWeight: '600' },
  roomInfo: { flex: 1 },
  otherName: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 2 },
  productBrand: { fontSize: 12, color: CLICK_COLOR, marginBottom: 3 },
  lastMessage: { fontSize: 13, color: '#666' },
  chevron: { fontSize: 22, color: '#ccc', marginLeft: 8 },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 80 },
});

export default ChatListPage;
