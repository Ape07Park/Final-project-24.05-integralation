import { useState } from 'react'; // useState를 사용하여 상태를 관리합니다.

// 스프링 부트에서 데이터를 가져오고 변경하는 데 사용할 서비스 및 API 함수를 import 합니다.
import { getItem, getItems, insertItem, updateItem, deleteItem } from '../../api/spring-boot'; 

export default function useItems(id) {
  // state를 사용하여 상태를 관리합니다.
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 아이템 가져오기
  const fetchItem = async (id) => {
    try {
      setLoading(true);
      const item = await getItem(id);
      setData(item);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // 아이템 목록 가져오기
  const fetchItems = async () => {
    try {
      setLoading(true);
      const items = await getItems();
      setData(items);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // 아이템 삽입
  const addItem = async (item) => {
    try {
      setLoading(true);
      await insertItem(item);
      fetchItems(); // 삽입 후 목록을 다시 가져옵니다.
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // 아이템 업데이트
  const updateItem = async (item) => {
    try {
      setLoading(true);
      await updateItem(item);
      fetchItems(); // 업데이트 후 목록을 다시 가져옵니다.
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // 아이템 삭제
  const deleteItem = async (id) => {
    try {
      setLoading(true);
      await deleteItem(id);
      fetchItems(); // 삭제 후 목록을 다시 가져옵니다.
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // 반환할 함수들을 정의합니다.
  return { data, error, loading, fetchItem, fetchItems, addItem, updateItem, deleteItem };
}
