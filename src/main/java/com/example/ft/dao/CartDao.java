package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.ft.entity.CartItem;
import com.example.ft.entity.CartItemRequest;

@Mapper
public interface CartDao {

    @Insert("INSERT INTO cart (iid, email, ioid, count) VALUES (#{iid}, #{email}, #{ioid} , #{count})")
    void addToCart(CartItemRequest CartItem);

//    @Select("SELECT * FROM cart WHERE email = #{email}")
//    List<CartItem> listCartItems(String email);
    
      // count(재고) 가져오는 sql문
//    @Select("SELECT c.cid, c.email, c.iid, i.name, i.img1, i.price, i.salePrice, i.saleDate, i.regDate, io.count " +
//            "FROM cart c " +
//            "INNER JOIN item i ON c.iid = i.iid " +
//            "INNER JOIN itemoption io ON i.iid = io.iid " +
//            "WHERE c.email = #{email}")
//    List<CartItem> listCartItems(String email);
    
	  @Select("SELECT c.cid, c.ioid, c.email, c.iid, c.count, i.name, i.img1, i.price, i.salePrice, i.saleDate, i.regDate " +
	  "FROM cart c " +
	  "INNER JOIN item i ON c.iid = i.iid " +
	  "INNER JOIN itemoption io ON i.iid = io.iid " +
	  "WHERE c.email = #{email}")
	  List<CartItem> listCartItems(String email);
    
//    @Select("SELECT c.cid, c.email, c.iid, i.name, i.img1, i.price, i.salePrice, i.saleDate, i.regDate " +
//            "FROM cart c " +
//            "INNER JOIN item i ON c.iid = i.iid " +
//            "WHERE c.email = #{email}")
//    List<CartItem> listCartItems(String email);

    @Update("UPDATE cart SET count = #{count} WHERE iid = #{iid}")
    void updateCartItem(int iid, int count);

    @Delete("DELETE FROM cart WHERE iid = #{iid}")
    void deleteCartItem(int iid);

    @Delete("DELETE FROM cart")
    void deleteAllCarts();

    @Select("SELECT * FROM cart WHERE iid = #{iid}")
    CartItem findCartItemByIid(int iid);

    @Select("SELECT EXISTS(SELECT 1 FROM cart WHERE email = #{email} AND iid = #{iid} AND ioid = #{ioid})")
    boolean checkItemInCart(String email, int iid, int ioid);
}