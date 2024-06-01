package com.example.ft.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ft.dao.ItemDao;
import com.example.ft.entity.Item;
import com.example.ft.entity.ItemOption;
import com.example.ft.entity.ItemTag;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService{
	private final ItemDao itemDao;
	
	// 순수 아이템
	@Override
	public Item getItemIId(int iid) {
		return itemDao.getItemIid(iid);
	}

	@Override
	public List<Item> getItemList() {
		return itemDao.getItemList();
	}
	
	@Override
	public List<Item> getItemNewList() {
		return itemDao.getItemNewList();
	}

	@Override
	public List<Item> getSearchItemList(String query) {
		query = query.replace("'", "''");
		query = "'%" + query + "%'";
		return itemDao.getSearchItemList(query);
	}

	@Override
	public void insertItem(Item item) {
		itemDao.insertItem(item);
	}

	@Override
	public void updateItem(Item item) {
		itemDao.updateItem(item);	
	}

	@Override
	public void deleteItem(int iid) {
		itemDao.deleteItem(iid);
	}

	@Override
	public void saleItem(Item item) {
		itemDao.saleItem(item);
	}

	@Override
	public void totalSta(Item item) {
		itemDao.totalSta(item);
	}
	
	// itemOption
	@Override
	public int[] getItemOptionIoid(int iid) {
		return itemDao.getItemOptionIoid(iid);
	}
	
	@Override
	public ItemOption getItemsOptionIoid(int ioid) {
		return itemDao.getItemsOptionIoid(ioid);
	}
	
	@Override
	public List<ItemOption> getItemOptionIId(int iid) {
		return itemDao.getItemOptionIId(iid);
	}
	
	@Override
	public void optionInsert(ItemOption itemOption) {
		itemDao.optionInsert(itemOption);
	}
	
	@Override
	public void optionUpdate(ItemOption itemOption) {
		itemDao.optionUpdate(itemOption);
	}
	
	@Override
	public void optionDeleted(int ioid) {
		itemDao.optionDeleted(ioid);
	}
	
	@Override
	public void inventoryCalculation(int ioid, int count) {
		itemDao.inventoryCalculation(ioid, count);
	}
	
	// itemTag
	@Override
	public int[] getItemTagItid(int iid) {
		return itemDao.getItemTagItid(iid);
	}
	
	@Override
	public List<ItemTag> getItemTagIId(int iid) {
		return itemDao.getItemTagIId(iid);
	}
	
	@Override
	public void tagInsert(ItemTag itemTag) {
		itemDao.tagInsert(itemTag);
	}

	@Override
	public void tagUpdate(ItemTag itemTag) {
		itemDao.tagUpdate(itemTag);
	}

	@Override
	public void tagDeleted(int itid) {
		itemDao.tagDeleted(itid);
	}

	@Override
	public List<Item> getMostReviewItemList() {
		return itemDao.getMostReviewItemList();
	}

	@Override
	public List<Item> getSaleItemList() {
		return itemDao.getSaleItemList();
	}

	@Override
	public List<Item> getHotItemList() {
		return itemDao.getHotItemList();
	}

	@Override
	public List<Item> getCategoryItemList(String menu) {
		return itemDao.getCategoryItemList(menu);
	}

	@Override
	public void inventoryCalculationCancel(int ioid, int count) {
		itemDao.inventoryCalculationCancel(ioid, count);
	}

}