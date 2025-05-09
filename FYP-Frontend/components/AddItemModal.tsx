import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  onClose: () => void;
  itemName: string;
  isLoading: boolean;
  setItemName: React.Dispatch<React.SetStateAction<string>>;
  itemImage: string | null;
  setItemImage: React.Dispatch<React.SetStateAction<string | null>>;
  pickImage: (fromCamera?: boolean) => void;
  locationPart: string | null;
  setLocationPart: React.Dispatch<React.SetStateAction<string | null>>;
  storageType: string | null;
  setStorageType: React.Dispatch<React.SetStateAction<string | null>>;
  locationParts: { label: string; value: string }[];
  storageTypes: { label: string; value: string }[];
  onSave: () => void;
}

export default function AddItemModal({
  visible,
  onClose,
  itemName,
  setItemName,
  itemImage,
  setItemImage,
  pickImage,
  isLoading,
  locationPart,
  setLocationPart,
  storageType,
  setStorageType,
  locationParts,
  storageTypes,
  onSave,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!itemName || !itemImage || !locationPart || !storageType) {
      setError('Please fill out all fields and select an image.');
      return;
    }

    setError(null);
    onSave();
    setItemName('');
    setItemImage(null);
    setLocationPart(null);
    setStorageType(null);
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} avoidKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalWrapper}
      >
        <View style={[styles.modal, { maxHeight: screenHeight * 0.85 }]}>
          <Text style={styles.modalTitle}>Add New Item</Text>

          <TextInput
            style={styles.input}
            placeholder="Item Name"
            placeholderTextColor="#888"
            value={itemName}
            onChangeText={setItemName}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => pickImage(true)}
            >
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => pickImage(false)}
            >
              <Ionicons name="image" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {itemImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: itemImage }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setItemImage(null)}
              >
                <Ionicons name="close-circle" size={24} color="#ff5555" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Position</Text>
            <Picker
              selectedValue={locationPart}
              onValueChange={setLocationPart}
              style={styles.picker}
            >
              <Picker.Item label="Select Position" value={null} />
              {locationParts.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Storage Type</Text>
            <Picker
              selectedValue={storageType}
              onValueChange={setStorageType}
              style={styles.picker}
            >
              <Picker.Item label="Select Storage" value={null} />
              {storageTypes.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.saveButton, isLoading && { backgroundColor: '#aaa' }]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#ff3333',
    marginBottom: 10,
    fontSize: 13,
    textAlign: 'center',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  inputBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 50,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewImage: {
    height: 100,
    width: '100%',
    borderRadius: 6,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
