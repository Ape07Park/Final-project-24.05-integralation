import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import '../css/itemInsert.css'; // CSS 파일 import

export default function ItemInsert() {
  const [form, setForm] = useState({ name: '', category: '', img1: '', img2: '', img3: '', content: '', price: '', option: [], count: [], tag: [], company: '', cost: '' });
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (form.img1) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };
      img.src = form.img1;
    }
  }, [form.img1]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  }

  const handleOptionChange = (index, event) => {
    const newOptions = [...form.option];
    newOptions[index] = event.target.value;
    setForm({ ...form, option: newOptions });
  }

  const handleCountChange = (index, event) => {
    const newCounts = [...form.count];
    newCounts[index] = event.target.value;
    setForm({ ...form, count: newCounts });
  }

  const handleTagChange = (index, event) => {
    const newTag = [...form.tag];
    newTag[index] = event.target.value;
    setForm({ ...form, tag: newTag });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // 이미지 자르기 영역 정보를 formData에 추가하여 서버로 전송
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const requestData = {
      ...form,
      img1: dataURL
    };
  
    axios
      .post('/ft/item/insert', requestData)
      .then(res => {
        console.log(res);
        navigate(-1);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleAddOptionAndCount = () => {
    const updatedOption = [...form.option, ''];
    const updatedCount = [...form.count, ''];
  
    setForm({
      ...form,
      option: updatedOption,
      count: updatedCount
    });
  }

  const handleAddTag = () => {
    setForm({ ...form, tag: [...form.tag, ''] });
  }

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.nativeEvent.offsetX);
    setStartY(e.nativeEvent.offsetY);
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 이미지를 다시 그릴 때, 기존 이미지를 그리는 부분을 주석처리합니다.
    // ctx.drawImage(new Image(form.img1), 0, 0);
  
    // 새로운 이미지를 그립니다.
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(startX, startY, x - startX, y - startY);
    };
    img.src = form.img1;
  
    setEndX(x);
    setEndY(y);
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  }

  return (
    <div className='itemInsert'>
      <Card className='itemInsert-card'>
        <CardContent className='card-content'>
          <form onSubmit={handleSubmit}>
            <div>
              <TextField label='상품명' name='name' value={form.name} onChange={handleChange} style={{marginBottom:10, width: '90%'}} />
            </div>
            <div>
              <TextField label='가구종류' name='category' value={form.category} onChange={handleChange} style={{marginBottom:10, width: '90%'}}  />
            </div>
            <div>
              <TextField label='가격' name='price' value={form.price} onChange={handleChange} style={{marginBottom:10, width: '90%'}}  />
            </div>
            <div>
              <TextField label='내용' name='content' value={form.content} onChange={handleChange} style={{marginBottom:10, width: '90%'}}  />
            </div>
            <div>
              <TextField label='회사명' name='company' value={form.company} onChange={handleChange} style={{marginBottom:10, width: '90%'}}  />
            </div>
            <div>
              <TextField label='원가' name='cost' value={form.cost} onChange={handleChange} style={{marginBottom:10, width: '90%'}}  />
            </div>
            <div className='options-container'>
              <label>옵션: </label>
                {form.option.map((opt, index) => (
                  <TextField key={index} label={`옵션 ${index + 1}`} value={opt} onChange={(e) => handleOptionChange(index, e)} style={{ marginRight: '10px', width: '20%', fontSize: '10px' }} />
                ))}
                <Button variant='contained' onClick={handleAddOptionAndCount} style={{ marginBottom: '10px', padding: '5px 10px', minWidth: 'unset' }}>옵션/갯수 추가</Button>
              </div>
              <div style={{ textAlign: 'left', marginLeft: 50, marginBottom: '10px' }}>
                <label>갯수: </label>
                {form.count.map((cnt, index) => (
                  <TextField key={index} label={`갯수 ${index + 1}`} value={cnt} onChange={(e) => handleCountChange(index, e)} style={{ marginRight: '10px', width: '20%' }} />
                ))}
              </div>
              <div style={{ textAlign: 'left', marginLeft: 50, marginBottom: '10px' }}>
                <label>태그: </label>
                {form.tag.map((tag, index) => (
                  <TextField key={index} label={`태그 ${index + 1}`} value={tag} onChange={(e) => handleTagChange(index, e)} style={{ marginRight: '10px', width: '20%' }} />
                ))}
              <Button variant='contained' onClick={handleAddTag} style={{ marginBottom: '10px', padding: '5px 10px', minWidth: 'unset' }}>추가</Button>
            </div>
            <div className='images-container'>
              <canvas 
                ref={canvasRef} 
                onMouseDown={handleMouseDown} 
                onMouseMove={handleMouseMove} 
                onMouseUp={handleMouseUp} 
                style={{ border: '1px solid black' }}
              />
              <br/>
              <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, img1: URL.createObjectURL(e.target.files[0]) })} />
            </div>
            <Button type='submit' variant='contained' className='form-button'>등록</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
