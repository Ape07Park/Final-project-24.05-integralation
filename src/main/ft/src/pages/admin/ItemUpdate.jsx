import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { uploadImage } from "../../api/cloudinary";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../css/itemUpdate.css';
import { getItemDetail, updateItem } from "../../api/itemApi";

export default function ItemUpdate() {
  const [form, setForm] = useState({ id: '', name: '', category: '', img1: '', img2: '', img3: '', content: '', price: '', company: '', cost: '', option: [''], count: [''], tag: [''] });
  const { iid } = useParams();
  const [options, setOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  // 초기값을 받아오는 useEffect
  useEffect(() => {
    getItemDetail(iid)
      .then(response => {
        const { item, options: fetchedOptions, tags: fetchedTags } = response;
  
        // 상품 정보를 폼에 채움
        setForm({
          id: item.iid,
          name: item.name,
          category: item.category,
          img1: item.img1,
          img2: item.img2,
          img3: item.img3,
          content: item.content,
          price: item.price,
          company: item.company, // 여기서 company 추가
          cost: item.cost, // 여기서 cost 추가
          option: fetchedOptions.map(option => option.option),
          count: fetchedOptions.map(option => option.count),
          tag: fetchedTags.map(tag => tag.tag),
        });
  
        setOptions(fetchedOptions);
        setTags(fetchedTags);
  
      })
      .catch(err => console.log(err))
  }, [iid]);
  
  // 폼 변경 핸들러
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  }

  // 옵션 변경 핸들러
  const handleOptionChange = (index, event) => {
    const newOptions = [...form.option];
    newOptions[index] = event.target.value;
    setForm(prevForm => ({
      ...prevForm,
      option: newOptions
    }));
  }

  // 갯수 변경 핸들러
  const handleCountChange = (index, event) => {
    const newCounts = [...form.count];
    newCounts[index] = event.target.value;
    setForm(prevForm => ({
      ...prevForm,
      count: newCounts
    }));
  }

  // 태그 변경 핸들러
  const handleTagChange = (index, event) => {
    const newTags = [...form.tag];
    newTags[index] = event.target.value;
    setForm(prevForm => ({
      ...prevForm,
      tag: newTags
    }));
  }

  // 옵션/갯수 추가 핸들러
  const handleAddOptionAndCount = () => {
    setForm(prevForm => ({
      ...prevForm,
      option: [...prevForm.option, ''],
      count: [...prevForm.count, '']
    }));
  }

  // 옵션/갯수 삭제 핸들러
  const handleRemoveOptionAndCount = (index) => {
    const newOptions = [...form.option];
    newOptions.splice(index, 1);
    const newCounts = [...form.count];
    newCounts.splice(index, 1);
    const newOptionsIds = [...options];
    newOptionsIds.splice(index, 1);
    setForm(prevForm => ({
      ...prevForm,
      option: newOptions,
      count: newCounts
    }));
    setOptions(newOptionsIds);
  }

  // 태그 추가 핸들러
  const handleAddTag = () => {
    setForm(prevForm => ({
      ...prevForm,
      tag: [...prevForm.tag, '']
    }));
  }

  // 태그 삭제 핸들러
  const handleRemoveTag = (index) => {
    const newTags = [...form.tag];
    newTags.splice(index, 1);
    const newTagsIds = [...tags];
    newTagsIds.splice(index, 1);
    setForm(prevForm => ({
      ...prevForm,
      tag: newTags
    }));
    setTags(newTagsIds);
  }

  // 이미지 업로드 핸들러
  const handleUpload = (name, file) => {
    if (file) {
      uploadImage(file).then(url => {
        setForm(prevForm => ({
          ...prevForm,
          [name]: url
        }));
      }).catch(error => {
        console.log('Error uploading image:', error);
      });
    }
  }

  // 폼 전송 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 빈 값을 0으로 설정하고, 숫자로 변환하는 처리 추가
    const option = form.option.map(opt => opt.trim() === '' ? 0 : opt);
    const count = form.count.map(cnt => typeof cnt === 'string' ? cnt.trim() === '' ? 0 : parseInt(cnt) : cnt);
    const tag = form.tag.map(t => t.trim() === '' ? 0 : t);

    // 폼 데이터 생성
    const requestData = {
      iid: form.id,
      name: form.name,
      category: form.category,
      img1: form.img1,
      img2: form.img2,
      img3: form.img3,
      content: form.content,
      price: form.price,
      company: form.company,
      cost: form.cost,
      option: option,
      count: count,
      tag: tag,
      ioid: options.map(option => option.ioid || 0), // 옵션의 ID 배열
      itid: tags.map(tag => tag.itid || 0) // 태그의 ID 배열
    };

    // 서버에 폼 데이터 전송
    updateItem(requestData)
      .then(res => {
        navigate(-1);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  const formImgDelete = (fieldName) => {
    if (window.confirm("정말로 사진을 삭제하시겠습니까?")) {
      setForm(prevForm => ({
        ...prevForm,
        [fieldName]: '' 
      }));
    }
  }

  return (
    <div className="itemUpdate">
      <Card className="card">
        <CardContent className="card-content">
          <form onSubmit={handleSubmit}>
            <div>
              <TextField label='상품명' name='name' value={form.name} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <TextField label='가구종류' name='category' value={form.category} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <TextField label='가격' name='price' value={form.price} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <TextField label='내용' name='content' value={form.content} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <TextField label='제조사' name='company' value={form.company} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <TextField label='원가' name='cost' value={form.cost} onChange={handleChange} className="form-input" />
            </div>
            <div className="options-section">
              <label>옵션/갯수: </label>
              {form.option.map((opt, index) => (
                <div key={index} className="option-input-container">
                  <br/>
                  <TextField label={`옵션 ${index + 1}`} value={opt} onChange={(e) => handleOptionChange(index, e)} className="option-input" />
                  <TextField label={`갯수 ${index + 1}`} value={form.count[index]} onChange={(e) => handleCountChange(index, e)} className="count-input" />
                  <Button variant='contained' onClick={() => handleRemoveOptionAndCount(index)} className="button">X</Button>
                </div>
              ))}
              <Button variant='contained' onClick={handleAddOptionAndCount} className="button">옵션/갯수 추가</Button>
            </div>
            <div className="tags-section">
              <label>태그: </label>
              {form.tag.map((tag, index) => (
                <div key={index} className="tag-input-container">
                  <br/>
                  <TextField label={`태그 ${index + 1}`} value={tag} onChange={(e) => handleTagChange(index, e)} className="tag-input" />
                  <Button variant='contained' onClick={() => handleRemoveTag(index)} className="button">X</Button>
                </div>
              ))}
              <Button variant='contained' onClick={handleAddTag} className="button">태그 추가</Button>
            </div>
            <div className="image-upload-section">
              <img src={form.img1} alt={form.img1} className="image-preview" /><br/>
              <input type="file" accept="image/*" onChange={(e) => handleUpload('img1', e.target.files[0])} />
              <Button size="small" style={{ border: '1px solid #f44336', backgroundColor: 'white', color: '#f44336', fontWeight: 'bold', }} onClick={() => formImgDelete('img1')}>사진삭제</Button>
            </div>
            <div className="image-upload-section">
              <img src={form.img2} alt={form.img2} className="image-preview" /><br/>
              <input type="file" accept="image/*" onChange={(e) => handleUpload('img2', e.target.files[0])} />
              <Button size="small" style={{ border: '1px solid #f44336', backgroundColor: 'white', color: '#f44336', fontWeight: 'bold', }} onClick={() => formImgDelete('img2')}>사진삭제</Button>
            </div>
            <div className="image-upload-section">
              <img src={form.img3} alt={form.img3} className="image-preview" /><br/>
              <input type="file" accept="image/*" onChange={(e) => handleUpload('img3', e.target.files[0])} />
              <Button size="small" style={{ border: '1px solid #f44336', backgroundColor: 'white', color: '#f44336', fontWeight: 'bold', }} onClick={() => formImgDelete('img3')}>사진삭제</Button>
            </div>
            <Button type='submit' variant='contained' className="button">수정</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
