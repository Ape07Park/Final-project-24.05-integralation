import React from 'react';

function DeliveryTracker() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const url = form.action;
    const t_key = form.t_key.value;
    const t_code = form.t_code.value;
    const t_invoice = form.t_invoice.value;
    
    // 창 크기와 위치를 설정합니다.
    const width = 400;
    const height = 800;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const specs = `width=${width}, height=${height}, left=${left}, top=${top}`;

    // 새 창을 엽니다.
    window.open(`${url}?t_key=${t_key}&t_code=${t_code}&t_invoice=${t_invoice}`, '_blank', specs);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} action="http://info.sweettracker.co.kr/tracking/5" method="post">
        <div className="form-group">
          {/* api키 */}
          <input type="text" className="form-control" name="t_key" value={'Wgo8jPI7FYIqrP8sekZlow'}/>
        </div>
        <div className="form-group">
          {/* 택배사 */}
          <input type="text" className="form-control" name="t_code" value={'04'}/>  
        </div>
        <div className="form-group">
          <label htmlFor="t_invoice">운송장 번호</label>
          <input type="text" className="form-control" name="t_invoice" placeholder="운송장 번호"/>
        </div>
        <button type="submit" className="btn btn-default">조회하기</button>
      </form>
    </div>
  );
}

export default DeliveryTracker;