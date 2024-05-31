import { Container, Grid } from "@mui/material";
import ItemCard from "./ItemCard";

export default function ItemGrid({ items, navigate }) {
  return (
    <Container>
      <Grid container spacing={2} className="itemList" >
        {items.map((item) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={item.iid} marginBottom={5}>
            <ItemCard item={item} navigate={navigate} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}