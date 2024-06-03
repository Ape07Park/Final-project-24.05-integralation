import React from 'react';
import { Grid, Paper, Typography, CardMedia } from '@mui/material';
import CountDown from './CountDown';
import { useNavigate } from 'react-router-dom';

const SelectedItemInfo = ({ selectedItem }) => {
  const navigate = useNavigate();

  if (!selectedItem) {
    return null;
  }

  return (
    <Grid container spacing={2} style={{ padding: 10 }}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Paper style={{ padding: 0 }}>
          <table style={{ width: '95%' }}>
            <tbody>
              <tr>
                <td style={{ width: '30%', paddingRight: 20 }} rowSpan="2">
                  <CardMedia
                    component="img"
                    image={selectedItem.item.img1}
                    alt="상품 이미지"
                    style={{ height: 200, cursor: 'pointer' }}
                    onClick={() => { navigate(`/item/detail/${selectedItem.item.iid}`) }}
                  />
                </td>
                <td style={{ verticalAlign: 'top', width: '40%' }}>
                  <Typography variant="h6" style={{ display: 'inline-block', lineHeight: '1.2', maxHeight: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedItem.name || '\u00A0'}
                  </Typography>
                  <Typography variant="body2">제조사: {selectedItem.item.company || '\u00A0'}</Typography>
                  <Typography variant="body2">원가: {selectedItem.item.cost ? selectedItem.item.cost.toLocaleString() + '원' : '\u00A0'}</Typography>
                  <Typography variant="body2">정가: {selectedItem.item.price ? selectedItem.item.price.toLocaleString() + '원' : '\u00A0'}</Typography>
                  <Typography variant="body2">할인금액:
                    {selectedItem.item.salePrice !== 0 && selectedItem.item.salePrice && new Date(selectedItem.item.saleDate) > new Date() && (
                      <>{selectedItem.item.salePrice.toLocaleString()}원</>
                    )}
                  </Typography>
                  <Typography variant="body2">할인율:
                    {selectedItem.item.salePrice !== 0 && selectedItem.item.salePrice && new Date(selectedItem.item.saleDate) > new Date() && (
                      <>{((selectedItem.item.price - selectedItem.item.salePrice) / selectedItem.item.price * 100).toFixed()}%</>
                    )}
                  </Typography>
                  <Typography variant="body2">할인기간: {new Date(selectedItem.item.saleDate) > new Date() ? <CountDown saleDate={selectedItem.item.saleDate} /> : ''}</Typography>
                  <Typography variant="body2">평점: {selectedItem.item.totalSta / 10 + '점' || '\u00A0'}</Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <Typography variant="h6">재고</Typography>
                  {selectedItem.options.map((opt, idx) => (
                    <Typography key={idx} variant="body2">{opt.option}: {(opt.stock === 0) ? '품절' : opt.stock + '개'}</Typography>
                  ))}
                  {selectedItem.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      style={{
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
                      onClick={() => { }}
                    >
                      #{tag.tag}
                    </span>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SelectedItemInfo;
