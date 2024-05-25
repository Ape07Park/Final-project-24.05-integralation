import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import AdminCategoryBar from "../components/AdminCategoryBar";
import { useNavigate } from "react-router-dom";

function Label({ componentName, valueType, isProOnly }) {
  const content = (
    <span>
      <strong>{componentName}</strong> for {valueType} editing
    </span>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif", // Set the desired font family here
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const groupAndSumData = (data) => {
  const groupedData = {};

  // 데이터를 주문일, 상품명, 옵션별로 그룹화
  data.forEach((item) => {
    const { orderDate, itemName, options, orderPrice, orderCount } = item;
    const key = `${orderDate}-${itemName}-${options}`;

    if (groupedData[key]) {
      groupedData[key].orderPrice += orderPrice;
      groupedData[key].orderCount += orderCount;
    } else {
      groupedData[key] = {
        ...item,
        orderPrice,
        orderCount,
      };
    }
  });

  // 그룹화된 데이터를 배열로 변환
  return Object.values(groupedData);
};

const HamburgerCheckbox = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedView, setSelectedView] = useState('all');
  const [selectedButton, setSelectedButton] = useState(0);
  const [datas, setDatas] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const groupedData = groupAndSumData(datas);
    setGroupedData(groupedData);
  }, [datas]);

  const handleViewChange = (event) => {
    setSelectedView(event.target.value);
  };
  const handleChange = (event) => {
    if (event.target.id === "start-date") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  const searchData = async () => {
    const response = await axios.get(
      `/ft/admin/products/${selectedView}?startDate=${startDate}&endDate=${endDate}`
    );
    const result = response.data;
    setDatas(result);
    console.log(result);
  };

  const handleReset = () => {
    setDatas([])
  };

  const handleViewClick = (index) => {
    setSelectedView(index)
  }

  const handleButtonClick = (index) => {
    setSelectedButton(index);
    const today = new Date();
    const yesterday = new Date(today);
    const weekAgo = new Date(today);
    const twoWeeksAgo = new Date(today);

    if (index === 0) {
      yesterday.setDate(today.getDate() - 1);
    } else if (index === 1) {
      weekAgo.setDate(today.getDate() - 7);
    } else if (index === 2) {
      twoWeeksAgo.setDate(today.getDate() - 15);
    }

    const formattedToday = today.toISOString().split("T")[0];
    setEndDate(formattedToday);

    if (index === 0) {
      setStartDate(yesterday.toISOString().split("T")[0]);
    } else if (index === 1) {
      setStartDate(weekAgo.toISOString().split("T")[0]);
    } else if (index === 2) {
      setStartDate(twoWeeksAgo.toISOString().split("T")[0]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <AdminCategoryBar/>
        <Card>
          <CardContent style={{ alignItems: "center", display: "flex" }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ marginRight: "45px" }}
            >
              기간
            </Typography>
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
              style={{ marginRight: "20px" }}
            >
              <Button
                variant={selectedButton === 0 ? "contained" : "outlined"}
                onClick={() => handleButtonClick(0)}
              >
                어제
              </Button>
              <Button
                variant={selectedButton === 1 ? "contained" : "outlined"}
                onClick={() => handleButtonClick(1)}
              >
                지난 7일
              </Button>
              <Button
                variant={selectedButton === 2 ? "contained" : "outlined"}
                onClick={() => handleButtonClick(2)}
              >
                지난 15일
              </Button>
            </ButtonGroup>

            <TextField
              id="start-date"
              label="Start Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate}
              onChange={handleChange}
              style={{ marginRight: "10px" }}
            />
            <div style={{ margin: "0 10px" }}>-</div>
            <TextField
              id="end-date"
              label="End Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={endDate}
              onChange={handleChange}
              style={{ marginRight: "20px" }}
            />

            <DemoItem
              label={
                <Label
                  componentName="DateRangePicker"
                  valueType="date range"
                  isProOnly
                />
              }
              component="DateRangePicker"
              style={{ marginLeft: "10px" }} // 추가된 부분
            />
          </CardContent>

          <CardContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  marginRight: "30px",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                쇼핑몰
              </span>
              <Select
                displayEmpty
                defaultValue=""
                style={{
                  width: "150px",
                  height: "42px",
                  fontFamily: "Roboto, sans-serif",
                }} // 글꼴 변경
              >
                <MenuItem
                  value=""
                  disabled
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  {" "}
                  전체
                </MenuItem>
              </Select>

              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={searchData}
                  style={{ padding: "32px 41px" }}
                >
                  검색
                </Button>
              </div>
            </Typography>
            <DemoItem
              label={
                <Label
                  componentName="DateRangePicker"
                  valueType="date range"
                  isProOnly
                />
              }
              component="DateRangePicker"
            ></DemoItem>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ display: "flex", alignItems: "center" }}
            >
              분석 관점
              <ButtonGroup
                value={selectedView}
                aria-label="분석 관점 선택"
                style={{ marginLeft: "10px" }}
              >
                <Button
                  variant={selectedView === 'all' ? "contained" : "outlined"}
                  onClick={() => handleViewClick('all')}
                  value="all"
                >전체</Button>
                <Button
                  variant={selectedView === 'category' ? "contained" : "outlined"}
                  onClick={() => handleViewClick('category')}
                  value="category"
                >카테고리</Button>
                <Button
                  variant={selectedView === 'company' ? "contained" : "outlined"}
                  onClick={() => handleViewClick('company')}
                  value="company"
                >제조사</Button>
              </ButtonGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                style={{ marginLeft: "auto", padding: "22px 34px" }}
              >
                초기화
              </Button>
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <Checkbox />
              <span style={{ marginLeft: "5px" }}>금액 상세보기</span>
              <FontAwesomeIcon
                icon={faDownload}
                style={{ marginLeft: "5px" }}
              />
              <span style={{ marginLeft: "5px" }}>현재 데이터 다운로드</span>
              <FontAwesomeIcon
                icon={faDownload}
                style={{ marginLeft: "5px" }}
              />
              <span style={{ marginLeft: "5px" }}>원본 데이터 다운로드</span>
            </div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                <TableRow style={{width: '100%'}}>
                  <StyledTableCell align="right" style={{width: '7%'}}>주문일</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '8%'}}>카테고리</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '38%'}}>상품명</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '8%'}}>옵션</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '8%'}}>주문 금액</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '8%'}}>수익</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '8%'}}>판매가</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '7%'}}>제조사</StyledTableCell>
                  <StyledTableCell align="right" style={{width: '8%'}}>결제 수량</StyledTableCell>
              </TableRow>
                </TableHead>
                <TableBody>
                  {groupedData.map((row, index) => (
                    <StyledTableRow key={index} onClick={() => (navigate(`/item/detail/${row.iid}`))}>
                      <StyledTableCell component="th" scope="row">{row.orderDate}</StyledTableCell>
                      <StyledTableCell align="right">{row.category}</StyledTableCell>
                      <StyledTableCell align="right">{row.itemName}</StyledTableCell>
                      <StyledTableCell align="right">{row.options}</StyledTableCell>
                      <StyledTableCell align="right">{row.orderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</StyledTableCell>
                      <StyledTableCell align="right">{row.itemPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</StyledTableCell>
                      <StyledTableCell align="right">{(row.orderPrice - row.itemPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</StyledTableCell>
                      <StyledTableCell align="right">{row.company}</StyledTableCell>
                      <StyledTableCell align="right">{row.orderCount}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </>
    </ThemeProvider>
  );
};

export default HamburgerCheckbox;
