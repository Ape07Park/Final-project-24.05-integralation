import React from "react";
import { CardContent, CardMedia } from "@mui/material";

import Rating from "../review/Rating"; 
import { Card } from "react-bootstrap";

const ItemDetailInfo = ({ item, tags, navigate }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        image={item.img1}
        alt={item.img1}
        style={{ height: 380 }}
      />
      <CardContent>
      {/* 상품 평점 및 태그 */}
      <Rating item={item} strSize={22}/>
      {tags.map((tag, index) => (
        <span 
          key={index}
          style={{ 
            cursor: 'pointer',
            display: "inline-block", 
            borderRadius: "999px",
            padding: "2px 8px", 
            marginRight: "5px",
            fontSize: "0.7rem", 
            fontWeight: "bold", 
            color: "black", 
            backgroundColor: "lightgrey", 
            border: "1px solid grey", 
          }}
          onClick={() => navigate(`/itemlist/${tag.tag}`)}
        >
          #{tag.tag}
        </span>
      ))}
      </CardContent>
    </Card>
  );
};

export default ItemDetailInfo;
