package com.example.ft.service;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import com.example.ft.entity.Item;
import com.example.ft.entity.ItemOption;
import com.example.ft.entity.ItemTag;

public interface ItemService {
	
	// 순수 아이템
	Item getItemIId(int iid);	
	
	List<Item> getItemList();
	
	List<Item> getItemNewList();
	
	List<Item> getSearchItemList(String query);
	
	void insertItem(Item item);	
	
	void updateItem(Item item);	
	
	void deleteItem(int iid);
	
	void saleItem(Item item);
	
	void totalSta(Item item);
	
	// itemOtion
	List<ItemOption> getItemOptionIId(int iid);
	
	int[] getItemOptionIoid(int iid);
	
	ItemOption getItemsOptionIoid(int ioid);

	void optionInsert(ItemOption itemOption);
	
	void optionUpdate(ItemOption itemOption);	
	
	void optionDeleted(int ioidsToDelete);
	
	void inventoryCalculation(int ioid, int count);
	
	// itemTag
	int[] getItemTagItid(int iid);
	
	List<ItemTag> getItemTagIId(int iid);
	
	void tagInsert(ItemTag itemTag);
	
	void tagUpdate(ItemTag itemTag);
	
	void tagDeleted(int itid);
	
	// 리뷰 많은순
	List<Item> getMostReviewItemList();
	
	// 세일중
	List<Item> getSaleItemList();
	
	// 구매가 많은 아이템(7일 기준으로)
	List<Item> getHotItemList();

	List<Item> getCategoryItemList(String menu);
	
	void inventoryCalculationCancel(int ioid, int count);
}