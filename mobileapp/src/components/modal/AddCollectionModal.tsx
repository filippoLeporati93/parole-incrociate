import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../AppText';
import {useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CollectionsUtils, {ICollection} from '../../utils/CollectionsUtils';
import SimpleInputModal from './SimpleInputModal';

interface IAddCollectionModal {
  show: boolean;
  onPressClose: () => void;
  locationId: string;
  imageRef: string | null;
}

const AddCollectionModal: FC<IAddCollectionModal> = ({
  show,
  onPressClose,
  locationId,
  imageRef,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = makeStyles(theme.colors);
  const [collections, setCollections] = useState<Array<ICollection>>([]);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [refreshCollections, setRefreshCollections] = useState(0);

  useEffect(() => {
    CollectionsUtils.getAllCollections().then(result => {
      let resultNoFavorites = result.filter(
        e => e.collectionName !== 'Preferiti'
      );
      setCollections(resultNoFavorites);
    });
  }, [showNewCollectionModal, refreshCollections]);

  const selectCollection = useCallback(
    (collectionName: string) => {
      let collection = collections.find(
        e => e.collectionName === collectionName
      );
      if (collection !== undefined) {
        if (collection?.locationIdList.indexOf(locationId) === -1) {
          CollectionsUtils.addLocationToCollection(
            locationId,
            collectionName,
            imageRef
          ).then(() => {
            setRefreshCollections(refreshCollections + 1);
          });
        } else {
          CollectionsUtils.deleteLocationToCollection(
            locationId,
            collectionName
          ).then(() => {
            setRefreshCollections(refreshCollections + 1);
          });
        }
      }
    },
    [collections, imageRef, locationId, refreshCollections]
  );

  const renderItem = ({item}: {item: ICollection}) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
        }}
        onPress={() => selectCollection(item.collectionName)}
      >
        <MaterialCommunityIcons
          name={
            collections
              .find(e => e.collectionName === item.collectionName)
              ?.locationIdList.find(e => e === locationId)
              ? 'checkbox-outline'
              : 'square-outline'
          }
          color={colors.text}
          size={22}
        />
        <Text style={{color: colors.text, fontSize: 18, marginLeft: 10}}>
          {item.collectionName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={show}>
        <SimpleInputModal
          title={'Aggiungi raccolta'}
          icon={'albums'}
          label={'Nome'}
          show={showNewCollectionModal}
          onPressOk={(inputText: string) => {
            CollectionsUtils.createCollection(inputText).then(() => {
              setShowNewCollectionModal(false);
            });
          }}
          onPressCancel={() => setShowNewCollectionModal(false)}
        />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.modalText}>Salva il luogo in...</Text>

              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginEnd: 10,
                }}
                onPress={() => {
                  setShowNewCollectionModal(true);
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={22}
                  color={theme.colors.text}
                />
                <Text style={styles.textStyle}>Nuova raccolta</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <FlatList
              data={collections}
              renderItem={renderItem}
              style={{width: '100%'}}
            />
            <View style={styles.divider} />
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flexDirection: 'row',
                    maxWidth: 100,
                    paddingVertical: 2,
                    marginStart: Platform.OS === 'ios' ? 30 : 10,
                  },
                ]}
                onPress={() => {
                  setShowNewCollectionModal(false);
                  onPressClose();
                }}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={22}
                  color={theme.colors.text}
                />
                <Text style={styles.textStyle}>Fine</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddCollectionModal;

const makeStyles = colors =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalView: {
      backgroundColor: 'white',
      height: 450,
      borderTopColor: '#ccc',
      borderTopWidth: 0.3,
      paddingVertical: 15,
      alignItems: 'flex-start',
    },
    divider: {
      borderBottomWidth: 0.8,
      borderBottomColor: '#ccc',
      width: '100%',
    },
    button: {
      flex: 1,
      padding: 0,
      alignItems: 'center',
    },
    textStyle: {
      fontSize: 17,
      marginLeft: 10,
      color: colors.text,
      textAlign: 'center',
    },
    modalText: {
      marginStart: 15,
      marginBottom: 15,
      fontSize: 17,
      textAlign: 'center',
      color: colors.text,
    },
  });
