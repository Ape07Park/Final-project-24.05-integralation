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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import axios from "axios";
import AdminCategoryBar from "../../components/admin/AdminCategoryBar";
import * as XLSX from "xlsx";
import { Container } from "@mui/material";

const formatCurrency = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
};

function Label({ componentName, valueType, isProOnly }) {
  const content = (
    <span>
      <strong>{componentName}</strong> for {valueType} editing
    </span>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
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

const filterAndGroupData = (data, view) => {
  const groupedData = {};

  data.forEach((item) => {
    const { orderDate, itemName, options, orderPrice, orderCount, category, company } = item;
    let key;
// key값 분류 다시하고
    switch (view) {
      case 'category':
        key = `${orderDate}-${category}-${itemName}-${options}`;
        break;
      case 'company':
        key = `${orderDate}-${company}-${itemName}-${options}`;
        break;
      case 'all':
      default:
        key = `${orderDate}-${itemName}-${options}`;
    }

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

  return Object.values(groupedData);
};

const HamburgerCheckbox = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedView, setSelectedView] = useState('all');
  const [selectedButton, setSelectedButton] = useState(0);
  const [datas, setDatas] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    const groupedData = filterAndGroupData(datas, selectedView);
    setGroupedData(groupedData);
  }, [datas, selectedView]);

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
  };

  const handleReset = () => {
    setDatas([]);
  };

  const handleViewClick = (view) => {
    setSelectedView(view);
  };

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
// 엑셀 코드 수정했습니다.
  const exportToExcel = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const filteredData = filterAndGroupData(datas, selectedView);
    const formattedData = filteredData.map(row => ({
      주문일: row.orderDate,
      카테고리: row.category,
      상품명: row.itemName,
      옵션: row.options,
      주문금액: formatCurrency(row.orderPrice * row.orderCount),
      원가: formatCurrency(row.itemPrice * row.orderCount),
      수익: formatCurrency((row.orderPrice - row.itemPrice) * row.orderCount),
      제조사: row.company,
      결제수량: row.orderCount,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `FUNniture_${currentDate}.xlsx`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <AdminCategoryBar />
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" style={{ marginBottom: "20px" }}>
              데이터 조회
            </Typography>
            <ButtonGroup
              value={selectedButton}
              aria-label="기간 선택"
              style={{ marginRight: "20px" }}
            >
              <Button
                variant={selectedButton === 0 ? "contained" : "outlined"}
                onClick={() => handleButtonClick(0)}
              >
                전일
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
              label="시작 날짜"
              type="date"
              value={startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginRight: "20px" }}
            />
            <TextField
              id="end-date"
              label="종료 날짜"
              type="date"
              value={endDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginRight: "20px" }}
            />
            <Button
              variant="contained"
              onClick={searchData}
              style={{ marginRight: "20px" }}
            >
              조회
            </Button>
            <Button variant="outlined"  style={{ marginRight: "20px" }} onClick={handleReset}>
              초기화
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faDownload} />}
              onClick={exportToExcel}
            >
              엑셀 다운로드
          </Button>
          </CardContent>
        </Card>
        <div style={{ margin: "20px 0" }}>
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
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>주문일</StyledTableCell>
                <StyledTableCell>카테고리</StyledTableCell>
                <StyledTableCell>상품명</StyledTableCell>
                <StyledTableCell>옵션</StyledTableCell>
                <StyledTableCell>주문금액</StyledTableCell>
                <StyledTableCell>원가</StyledTableCell>
                <StyledTableCell>수익</StyledTableCell>
                <StyledTableCell>제조사</StyledTableCell>
                <StyledTableCell>결제수량</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody> 
              {groupedData.map((row) => (
                <StyledTableRow key={`${row.orderDate}-${row.itemName}-${row.options}`}>
                  <StyledTableCell>{row.orderDate}</StyledTableCell>
                  <StyledTableCell>{row.category}</StyledTableCell>
                  <StyledTableCell>{row.itemName}</StyledTableCell>
                  <StyledTableCell>{row.options}</StyledTableCell>
                  <StyledTableCell>{formatCurrency(row.orderPrice * row.orderCount)}</StyledTableCell>
                  <StyledTableCell>{formatCurrency(row.itemPrice * row.orderCount)}</StyledTableCell>
                  <StyledTableCell>{formatCurrency((row.orderPrice - row.itemPrice) * row.orderCount)}</StyledTableCell>
                  <StyledTableCell>{row.company}</StyledTableCell>
                  <StyledTableCell>{row.orderCount}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default HamburgerCheckbox;
