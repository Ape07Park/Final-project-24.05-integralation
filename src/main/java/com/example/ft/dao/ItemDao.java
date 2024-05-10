package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

import com.example.ft.entity.Item;
import com.example.ft.entity.ItemOption;
import com.example.ft.entity.ItemTag;

@Mapper
public interface ItemDao {
	
	@Select("select * from item where iId=#{iid} and isDeleted=0")
	Item getItemIid(int iid);

	@Select("select * from item where isDeleted=0 order by regDate desc")
	List<Item> getItemList();
	
	@Select("select * from item WHERE CONCAT(name, category, content, option, tag) LIKE ${query} AND isDeleted=0 order by regDate desc")
	List<Item> getSearchItemList(String query);
	
	@Insert("insert into item values (default, #{name}, #{category}, #{img1}, #{img2}, #{img3},"
			+ " #{content}, #{price}, default, default, default, default, default, #{company}, #{cost})")
	@SelectKey(statement="SELECT LAST_INSERT_ID()", keyProperty="iid", before=false, resultType=int.class)
	void insertItem(Item item);
	
	@Update("update item set name=#{name}, category=#{category}, img1=#{img1}, img2=#{img2}, img3=#{img3},"
			+ " content=#{content}, company=#{company}, cost=#{cost}, price=#{price} where iid=#{iid}")
	void updateItem(Item item);	
	
	@Update("update item set isDeleted=1 where iid=#{iid}")
	void deleteItem(int iid);
	
	@Update("update item set salePrice=#{salePrice}, saleDate=#{saleDate} where iid=#{iid}")
	void saleItem(Item item);
	
	@Update("update item set totalSta=#{totalSta} where iid=#{iid}")
	void totalSta(Item item);
	
	// itemOption
	@Select("select ioid from itemOption where iId=#{iid} and isDeleted=0")
	int[] getItemOptionIoid(int iid);
	
	@Select("select * from itemOption where ioid=#{ioid}")
	ItemOption getItemsOptionIoid(int ioid);
	
	@Select("select * from itemOption where iId=#{iid} and isDeleted=0")
	List<ItemOption> getItemOptionIId(int iid);
	
	@Insert("insert into itemoption values (default, #{iid}, #{option}, #{count}, default)")
	void optionInsert(ItemOption itemOption);
	
	@Update("update itemoption set `option`=#{option}, count=#{count} where ioid=#{ioid}")
	void optionUpdate(ItemOption itemOption);	
	
	@Update("update itemoption set isDeleted=1 where ioid=#{ioid}")
	void optionDeleted(int ioid);
	
	@Update("update itemoption set count= count-#{count} where ioid=#{ioid}")
	void inventoryCalculation(int ioid, int count);
	
	// itemTag
	@Select("select itid from itemTag where iId=#{iid} and isDeleted=0")
	int[] getItemTagItid(int iid);

	@Select("select * from itemTag where iId=#{iid} and isDeleted=0")
	List<ItemTag> getItemTagIId(int iid);
	
	@Insert("insert into itemtag values (default, #{iid}, #{tag}, default)")
	void tagInsert(ItemTag itemTag);
	
	@Update("update itemtag set tag=#{tag} where itid=#{itid}")
	void tagUpdate(ItemTag itemTag);
	
	@Update("update itemtag set isDeleted=1 where itid=#{itid}")
	void tagDeleted(int itid);
}