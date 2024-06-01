package com.example.ft.dao;

import com.example.ft.dto.CartItemResponseDto;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CartDaoV2 {

    @Insert("INSERT INTO cart (iid, email, ioid, count) VALUES (#{iid}, #{email}, #{ioid} , #{count})")
    int addCartItem(int iid, String email, int ioid, int count);

    @Select("select count " +
            "from cart " +
            "where email = #{email} " +
            "and iid = #{iid} " +
            "and ioid = #{ioid}")
    CartItemResponseDto findByItemAndOptionId(String email, int iid, int ioid);

    @Select("select count " +
            "from itemOption " +
            "where iid = #{iid} " +
            "and ioid = #{ioid}")
    CartItemResponseDto findCountByItem(int iid, int ioid);


    @Select("select c.cid, c.ioid, c.email," +
            "       c.iid, c.count, i.name," +
            "       i.img1, i.price, i.salePrice," +
            "       i.saleDate, i.regDate,c.ioid, io.option, io.count as stockCount " +
            "from cart c " +
            "left join item i " +
            "on i.iid = c.iid " +
            "left join itemOption io " +
            "on c.ioid = io.ioid " +
            "where c.email = #{email} " +
            "order by c.ioid desc, c.iid desc")
    List<CartItemResponseDto> findAllByUserEmail(String email);
    
    @Delete("DELETE FROM cart WHERE cid = #{cid} and email = #{email}")
    int deleteCartItem(String email, int cid);

    @Delete("DELETE FROM cart WHERE email = ${email}")
    int deleteAllCartItem(String email);

    @Update("update cart set count = #{updateCount} where cid = #{cid} and email = #{email}")
    int updateCartItem(String email, int cid, int updateCount);
    
    @Delete("DELETE FROM cart WHERE email IN (SELECT email FROM `order` WHERE oid=#{oid})")
    void deletePaymentAllCartItme(int oid);

}
