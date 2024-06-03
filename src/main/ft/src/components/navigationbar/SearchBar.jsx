
import React from 'react';
import { styled, alpha, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '10ch',
    },
  },
}));

export default function SearchBar() {
  const navigate = useNavigate();

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = (event) => {
    event.preventDefault(); // 기본 이벤트 방지
    const searchQuery = event.target.elements.search.value.trim(); // 검색어 추출
    if (searchQuery) {
      navigate(`/itemlist/${searchQuery}`); // navigate 함수로 페이지 이동
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          name="search"
          placeholder="검색"
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
    </form>
  );
}
