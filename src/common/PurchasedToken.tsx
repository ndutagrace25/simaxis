const PurchasedToken = () => {
  return (
    <div className="shadow-sm rounded p-3 bg-white mb-3">
      <div className="d-flex justify-content-between mb-2 ">
        <div>Meter:</div>
        <div className="meter-title">37185698745</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Token:</div>
        <div className="meter-title mb-2">1475-0553-400-5370-9209</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Date:</div>
        <div className="meter-title mb-2">2024-03-10</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Units:</div>
        <div className="meter-title mb-2">70.16</div>
      </div>
      <div className="d-flex justify-content-between ">
        <div>Amount:</div>
        <div className="meter-title mb-2">KES 2000</div>
      </div>
    </div>
  );
};

export default PurchasedToken;
