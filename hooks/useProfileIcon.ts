import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useProfileIcon = (userId: string | undefined) => {
  const [profileIcon, setProfileIcon] = useState('👤');

  useEffect(() => {
    const loadIcon = async () => {
      if (userId) {
        try {
          const savedIcon = await AsyncStorage.getItem(`profileIcon_${userId}`);
          if (savedIcon) {
            setProfileIcon(savedIcon);
          }
        } catch (err) {
          console.error('Error loading icon:', err);
        }
      }
    };
    loadIcon();
  }, [userId]);

  const saveIcon = async (icon: string) => {
    setProfileIcon(icon);
    if (userId) {
      try {
        await AsyncStorage.setItem(`profileIcon_${userId}`, icon);
      } catch (err) {
        console.error('Error saving icon:', err);
      }
    }
  };

  return { profileIcon, saveIcon };
};
