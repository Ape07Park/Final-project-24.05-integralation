package com.example.ft.controller;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ft.entity.Item;
import com.example.ft.entity.ItemOption;
import com.example.ft.entity.ItemRequest;
import com.example.ft.entity.ItemTag;
import com.example.ft.entity.SaleData;
import com.example.ft.entity.Wish;
import com.example.ft.service.ItemService;
import com.example.ft.service.RealTimesService;
import com.example.ft.service.WishService;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@Slf4j 
@RestController
@RequestMapping("/item")	
@RequiredArgsConstructor
public class ItemController {
	private final ItemService itemService;
	private final WishService wishService;
	private final RealTimesService realTimeService;
	
	@GetMapping("/list")
	public JSONArray list() {
		List<Item> list = itemService.getItemList();
		JSONArray jArr = new JSONArray();
		for(Item item : list) {
			JSONObject jObj = new JSONObject(); 
			jObj.put("iid", item.getIid());
			jObj.put("name", item.getName());
			jObj.put("category", item.getCategory());
			jObj.put("img1", item.getImg1());
			jObj.put("content", item.getContent());
			jObj.put("price", item.getPrice());
			jObj.put("salePrice", item.getSalePrice());
			jObj.put("saleDate", item.getSaleDate());
			jObj.put("regDate", item.getRegDate());
			jObj.put("totalSta", item.getTotalSta());
			jObj.put("company", item.getCompany());
			jObj.put("cost", item.getCost());
			jArr.add(jObj);
		}
		return jArr;
	}
	
	@GetMapping("/search/{query}")
    public JSONArray getSearchItemList(@PathVariable String query) {
		realTimeService.insertRealTime(query);
        List<Item> list = itemService.getSearchItemList(query);
        JSONArray jArr = new JSONArray();
        for (Item item : list) {
            JSONObject jObj = new JSONObject();
            jObj.put("iid", item.getIid());
            jObj.put("name", item.getName());
            jObj.put("category", item.getCategory());
            jObj.put("img1", item.getImg1());
            jObj.put("img2", item.getImg2());
            jObj.put("img3", item.getImg3());
            jObj.put("content", item.getContent());
            jObj.put("price", item.getPrice());
            jObj.put("salePrice", item.getSalePrice());
            jObj.put("saleDate", item.getSaleDate());
            jObj.put("regDate", item.getRegDate());
            jObj.put("isDeleted", item.getIsDeleted());
            jObj.put("totalSta", item.getTotalSta());
            jObj.put("company", item.getCompany());
            jObj.put("cost", item.getCost());
            jArr.add(jObj);
        }
        return jArr;
    }
	
	@GetMapping("/newList")
	public JSONArray newList() {
		List<Item> list = itemService.getItemNewList();
		JSONArray jArr = new JSONArray();
		for(Item item : list) {
			JSONObject jObj = new JSONObject(); 
			jObj.put("iid", item.getIid());
			jObj.put("name", item.getName());
			jObj.put("category", item.getCategory());
			jObj.put("img1", item.getImg1());
			jObj.put("img2", item.getImg2());
			jObj.put("img3", item.getImg3());
			jObj.put("content", item.getContent());
			jObj.put("price", item.getPrice());
			jObj.put("salePrice", item.getSalePrice());
			jObj.put("saleDate", item.getSaleDate());
			jObj.put("regDate", item.getRegDate());
			jObj.put("isDeleted", item.getIsDeleted());
			jObj.put("totalSta", item.getTotalSta());
			jObj.put("company", item.getCompany());
			jObj.put("cost", item.getCost());
			jArr.add(jObj);
		}
		return jArr;
	}
	
	@GetMapping("/detail/{iid}/{email}")
	public JSONObject getItemDetail(@PathVariable int iid,@PathVariable String email) {
		Item item = itemService.getItemIId(iid);
		JSONObject jItem = new JSONObject();
		jItem.put("iid", item.getIid());
		jItem.put("name", item.getName());
		jItem.put("category", item.getCategory());
		jItem.put("img1", item.getImg1());
		jItem.put("img2", item.getImg2());
		jItem.put("img3", item.getImg3());
		jItem.put("content", item.getContent());
		jItem.put("price", item.getPrice());
		jItem.put("salePrice", item.getSalePrice());
		jItem.put("saleDate", item.getSaleDate());
		jItem.put("regDate", item.getRegDate());
		jItem.put("isDeleted", item.getIsDeleted());
		jItem.put("totalSta", item.getTotalSta());
		jItem.put("company", item.getCompany());
		jItem.put("cost", item.getCost());
		
		List<ItemOption> itemOptionlist = itemService.getItemOptionIId(iid);
		JSONArray jArrOption = new JSONArray();
		for(ItemOption option : itemOptionlist) {
			JSONObject jObj = new JSONObject(); 
			jObj.put("ioid", option.getIoid());
			jObj.put("iid", option.getIid());
			jObj.put("option", option.getOption());
			jObj.put("count", option.getCount());
			jObj.put("isDeleted", option.getIsDeleted());
			jArrOption.add(jObj);
		}
		
		List<ItemTag> itemTaglist = itemService.getItemTagIId(iid);
		JSONArray jArrTag = new JSONArray();
		for(ItemTag tag : itemTaglist) {
			JSONObject jObj = new JSONObject(); 
			jObj.put("itid", tag.getItid());
			jObj.put("iid", tag.getIid());
			jObj.put("tag", tag.getTag());
			jObj.put("isDeleted", tag.getIsDeleted());
			jArrTag.add(jObj);
		}
		Wish wish = wishService.getWish(iid, email);
		int value = 0;
		if (wish != null) {
			value = wish.getValue();	
		}
		JSONObject response = new JSONObject();
	    response.put("item", jItem);
	    response.put("options", jArrOption);
	    response.put("tags", jArrTag);
	    response.put("value", value);
		return response;
	}
	
	@PostMapping("/insert")
	public String ItemInsert(@RequestBody ItemRequest itemRequest) {
	    Item item = Item.builder()
	            .name(itemRequest.getName()).category(itemRequest.getCategory())
	            .img1(itemRequest.getImg1()).img2(itemRequest.getImg2())
	            .img3(itemRequest.getImg3()).content(itemRequest.getContent())
	            .price(itemRequest.getPrice()).company(itemRequest.getCompany()).cost(itemRequest.getCost())
	            .build();
	    itemService.insertItem(item);
	    String[] option = itemRequest.getOption();
	    int[] count = itemRequest.getCount();
	    String[] tag = itemRequest.getTag();
	    for (int i = 0; i < option.length; i++) {
	    	if (!option[i].trim().isEmpty() && !(count[i] == 0)) {
	        ItemOption itemOption = ItemOption.builder()
	                .iid(item.getIid()).option(option[i]).count(count[i])
	                .build();
	        itemService.optionInsert(itemOption);
	        }
	    }
	    for (int i = 0; i < tag.length; i++) {
	    	if(tag[i] != null && !tag[i].trim().isEmpty()) {
	        ItemTag itemTag = ItemTag.builder()
	                .iid(item.getIid()).tag(tag[i])
	                .build();
	        itemService.tagInsert(itemTag);
	    	}
	    }

	    return "Success";
	}

	@PostMapping("/update")
	public String ItemUpdate(@RequestBody ItemRequest itemRequest) {
		// 상품 정보 업데이트
	    Item item = Item.builder()
	            .name(itemRequest.getName())
	            .category(itemRequest.getCategory())
	            .img1(itemRequest.getImg1())
	            .img2(itemRequest.getImg2())
	            .img3(itemRequest.getImg3())
	            .content(itemRequest.getContent())
	            .price(itemRequest.getPrice())
	            .iid(itemRequest.getIid())
	            .company(itemRequest.getCompany())
	            .cost(itemRequest.getCost())
	            .build();
	    itemService.updateItem(item);
	    
	    int[] ioid = itemService.getItemOptionIoid(itemRequest.getIid());
	    int[] itid = itemService.getItemTagItid(itemRequest.getIid());

	    Integer[] requestedIoids = itemRequest.getIoid();
	    Integer[] requestedItids = itemRequest.getItid();
	    if (requestedIoids != null) {
	        for (int i = 0; i < ioid.length; i++) {
	            boolean found = false;
	            for (int j = 0; j < requestedIoids.length; j++) {
	                if (ioid[i] == requestedIoids[j]) {
	                    found = true;
	                    break;
	                }
	            }
	            if (!found) {
	                itemService.optionDeleted(ioid[i]);
	            }
	        }
	    }

	    if (requestedItids != null) {
	        for (int i = 0; i < itid.length; i++) {
	            boolean found = false;
	            for (int j = 0; j < requestedItids.length; j++) {
	                if (itid[i] == requestedItids[j]) {
	                    found = true;
	                    break;
	                }
	            }
	            if (!found) {
	                itemService.tagDeleted(itid[i]);
	            }
	        }
	    }

	    String[] options = itemRequest.getOption();
	    int[] counts = itemRequest.getCount();
	    Integer[] ioids = itemRequest.getIoid();
	    if (options != null && counts != null) {
	        for (int i = 0; i < options.length; i++) {
	            if (i < counts.length && counts[i] >= 0) { 
	                if (ioids != null && i < ioids.length && ioids[i] != null && ioids[i] != 0) { 
	                	ItemOption itemOption = ItemOption.builder()
	                            .option(options[i])
	                            .count(counts[i])
	                            .ioid(ioids[i])
	                            .build();
	                    itemService.optionUpdate(itemOption);
	                } else { 
	                    ItemOption itemOption = ItemOption.builder()
	                            .iid(itemRequest.getIid())
	                            .option(options[i])
	                            .count(counts[i])
	                            .build();
	                    itemService.optionInsert(itemOption);
	                }
	            }
	        }
	    }

	    String[] tags = itemRequest.getTag();
	    Integer[] itids = itemRequest.getItid();

	    if (itids != null && itids.length < tags.length) {
	        Integer[] newItids = Arrays.copyOf(itids, tags.length);
	        Arrays.fill(newItids, itids.length, tags.length, 0);
	        itids = newItids;
	    }

	    if (tags != null) {
	        for (int i = 0; i < tags.length; i++) {
	            if (i < itids.length && itids[i] != null && itids[i] != 0) {
	                ItemTag itemTag = ItemTag.builder()
	                        .tag(tags[i])
	                        .itid(itids[i])
	                        .build();
	                itemService.tagUpdate(itemTag);
	            } else { 
	                ItemTag itemTag = ItemTag.builder()
	                        .iid(itemRequest.getIid())
	                        .tag(tags[i])
	                        .build();
	                itemService.tagInsert(itemTag);
	            }
	        }
	    }

	    return null;
	}
	
	@DeleteMapping("/delete/{iid}")
	public ResponseEntity<String> deleteItem(@PathVariable int iid) {
	    itemService.deleteItem(iid);
	    return ResponseEntity.ok("Item delete");
	}
	
	@PostMapping("/sale")
    public String saleItem(@RequestBody SaleData saleData) {
        int iid = saleData.getIid();
        int salePrice = saleData.getSalePrice();
        ZonedDateTime saleDate = saleData.getSaleDate();
        LocalDateTime saleDateLDT = saleDate.toLocalDateTime();

	    Item item = Item.builder()
	                    .salePrice(salePrice)
	                    .saleDate(saleDateLDT)
	                    .iid(iid)
	                    .build();

	    itemService.saleItem(item);
	    return "Success";
	}
	
	@GetMapping("itemMenu/{menu}")
	public JSONArray getlist(@PathVariable String menu) {
		List<Item> list = new ArrayList<>();
		switch (menu) {
			case "hot": {
				list = itemService.getHotItemList();
				break;
			}
			case "sale": {
				list = itemService.getSaleItemList();
				break;
			}
			case "mostReview": {
				list = itemService.getMostReviewItemList();
				break;
			}
			default :{
				list = itemService.getCategoryItemList(menu);
				break;
			}
		}
		JSONArray jArr = new JSONArray();
		for(Item item : list) {
			JSONObject jObj = new JSONObject(); 
			jObj.put("iid", item.getIid());
			jObj.put("name", item.getName());
			jObj.put("category", item.getCategory());
			jObj.put("img1", item.getImg1());
			jObj.put("content", item.getContent());
			jObj.put("price", item.getPrice());
			jObj.put("salePrice", item.getSalePrice());
			jObj.put("saleDate", item.getSaleDate());
			jObj.put("regDate", item.getRegDate());
			jObj.put("totalSta", item.getTotalSta());
			jObj.put("company", item.getCompany());
			jObj.put("cost", item.getCost());
			jArr.add(jObj);
		}
		return jArr;
	}
	
}