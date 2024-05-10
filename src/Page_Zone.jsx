import React, { useState, useEffect } from 'react';

const Zone = () => {
  const [zoneData, setZoneData] = useState([]);
  const [zoneId, setZoneId] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [critical, setCritical] = useState('');
  const [thresholdHumidity, setThresholdHumidity] = useState('');
  const [thresholdGas, setThresholdGas] = useState('');
  const [thresholdTemp, setThresholdTemp] = useState('');
  const resetZoneState = () => {
    setZoneId(''); 
    setZoneName('');
    setCritical('');
    setThresholdHumidity('');
    setThresholdGas('');
    setThresholdTemp('');
  };

  // Define state to control the visibility of the tag
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);

  // Function to toggle the visibility
  const toggleAddVisibility = () => {
      setModalAddVisible(!modalAddVisible);
  };
  
  // Update Modal Visibility function
  const toggleUpdateVisibility = (zoneId) => {
    if(!modalUpdateVisible){
      fetch(`https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/zone?zoneId=${zoneId}`)
      .then((res) => res.json())
      .then(res => {
        // console.log('Response Zone:', res);
        if (res) {
          setZoneId(res.zone_id); 
          setZoneName(res.zone_name);
          setCritical(res.critical_level);
          setThresholdGas(res.threshold_gas);
          setThresholdHumidity(res.threshold_humidity);
          setThresholdTemp(res.threshold_temp);
          setModalUpdateVisible(true);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => console.error('Error fetching data:', error));

    }
    else{
      setModalUpdateVisible(false);
      resetZoneState();
    }
    
  };

  // zone {
  //  'zone_id':
  //  'zone_name':
  //  'zone_status':
  //  'critical_level':
  //  'threshold_gas'
  //  'threshold_temp'
  //  'threshold_humidity'
  //  'created_on':
  //  'modified_on':
  // } 

  // GET /zones
  useEffect(() => {
  fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/zones')
    .then((res) => res.json())
    .then(res => {
      // console.log('Response Zones:', res);
      if (res && Array.isArray(res.zones)) {
        // Map the data array to a new format
        const mappedData = res.zones.map(item => {
          return {
            zone_id: item.zone_id,
            zone_name: item.zone_name,
            critical_level: item.critical_level,
            zone_status: item.zone_status,
            threshold_gas: item.threshold_gas,
            threshold_temp: item.threshold_temp,
            threshold_humidity: item.threshold_humidity,
            created_on: item.created_on,
            modified_on: item.modified_on
          };
        });
        setZoneData(mappedData);
        
      } else {
        throw new Error('Invalid response format');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
  });

  // POST /zone
  const handleZoneAdd = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const zoneData = {
      zone_id: parseInt(zoneId),
      zone_name: zoneName,
      critical_level: critical,
      zone_status: 'Unscanned',
      threshold_gas: thresholdGas,
      threshold_temp: thresholdHumidity,
      threshold_humidity: thresholdTemp,
      created_on: Date.now(),
      modified_on: null,
    };
    // console.log(zoneData)

    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header for JSON data
        },
        body: JSON.stringify(zoneData), // Convert zoneData to JSON format
      })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Zone has been added",
          showConfirmButton: false,
          timer: 1500
        });
        resetZoneState();
        toggleAddVisibility();
      } else {
        
        throw new Error('Failed to post zone data');
      }
    })
    .catch(error => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#1f629c",
      });
    });
  };

  // PATCH /zone
  const handleZoneUpdate = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const zoneData = {
      zone_id: parseInt(zoneId),
      zone_name: zoneName,
      critical_level: critical,
      threshold_gas: thresholdGas,
      threshold_temp: thresholdHumidity,
      threshold_humidity: thresholdTemp,
      modified_on: Date.now()
    };
    console.log(zoneData)

    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/zone', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header for JSON data
        },
        body: JSON.stringify(zoneData), // Convert zoneData to JSON format
      })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Zone has been updated",
          showConfirmButton: false,
          timer: 1500
        });
        resetZoneState();
        toggleUpdateVisibility();
      } else {
        
        throw new Error('Failed to update zone data');
      }
    })
    .catch(error => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#1f629c",
      });
    });
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="card ">
            <div className="card-header d-flex">
              <div className="col-md-6">
                <h4 className="card-title font-weight-bold"> Zones List</h4>
              </div>
              <div className="col-md-6 text-right">
                <button className="btn btn-fill btn-info" onClick={toggleAddVisibility}>Add</button>
              </div>
            </div>
            <div className="card-body">
              <div className="">
                <table id="Table" className="table tablesorter ">
                  <thead className=" text-primary">
                    <tr>
                      <th>
                        ID
                      </th>
                      <th>
                        Name
                      </th>
                     
                      <th className="text-center">
                        Critical Level
                      </th>
                      <th className="text-center">
                        Temperature Th
                      </th>
                      <th className="text-center">
                        Gas Th
                      </th>
                      <th className="text-center">
                        Humidity Th
                      </th>

                      <th className="text-center">
                        Status
                      </th>

                      <th className="text-center">
                        Created on
                      </th>

                      <th className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    zoneData.map((item) => (
                      <tr key={item.zone_id}>
                      <td className="text-center">
                      {item.zone_id}
                      </td>

                      <td >
                      {item.zone_name}
                      </td>
                      
                      <td className="text-center">
                        <span className={item.critical_level == 'High'? 'redStatus': item.critical_level == 'Moderate'? 'orangeStatus' : 'blueStatus'}>{item.critical_level}</span>
                      </td>
                      
                      <td className="text-center">
                      {item.threshold_temp}
                      </td >

                      <td className="text-center">
                      {item.threshold_gas}
                      </td>

                      <td className="text-center">
                      {item.threshold_humidity}
                      </td>

                      <td className="text-center">
                        <span className={item.zone_status == 'Scanned'? "greenStatus": "grayStatus" }>{item.zone_status}</span>
                      </td>
                      
                      <td className="text-center">
                        {new Date(item.created_on).toLocaleString() }
                      </td>
                      <td className="text-center">
                        <button className="btn" onClick={() =>toggleUpdateVisibility(item.zone_id)}>Edit</button>
                      </td>
                    </tr>
                    ))
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalAddVisible &&
      <div className="modall">
        <div className="modall-content">
          <span className="close" onClick={toggleAddVisibility} >&times;</span>
          <h4>Add Zone</h4>
          <form onSubmit={handleZoneAdd}>
            <div className="row">
              <div className="col-md-4 pr-md-1">
                <div className="form-group">
                  <input className="form-control" 
                        type="number" 
                        value={zoneId} 
                        onChange={e => setZoneId(e.target.value)} 
                        placeholder='Zone Id'
                        required/>
                </div>
              </div>
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <input className="form-control" 
                          type="text" 
                          value={zoneName} 
                          onChange={e => setZoneName(e.target.value)} 
                          placeholder='Zone Name'
                          required/>
                </div>
              </div>
              <div className="col-md-4 pl-md-1">
                <div className="form-group">
                  <select className="form-control" 
                    value={critical} onChange={e => setCritical(e.target.value)}
                    required>
                    <option value="" disabled>Critical Level</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 pr-md-1">
                <div className="form-group">
                  <input className="form-control" 
                        type="number" 
                        value={thresholdTemp} 
                        onChange={e => setThresholdTemp(e.target.value)} 
                        placeholder='Temperature Threshold'
                        required/>
                </div>
              </div>
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <input className="form-control" 
                          type="number" 
                          value={thresholdHumidity} 
                          onChange={e => setThresholdHumidity(e.target.value)} 
                          placeholder='Humidity Threshold'
                          required/>
                </div>
              </div>
              <div className="col-md-4 pl-md-1">
                <div className="form-group">
                  <input className="form-control" 
                          type="number" 
                          value={thresholdGas} 
                          onChange={e => setThresholdGas(e.target.value)} 
                          placeholder='Gas Threshold'
                          required/>
                </div>
              </div>
              
            </div>
          
            <div className="row">
              <div className="col-md-12 text-center">
                <input type='submit' className="btn btn-fill btn-info text-sm" value='Submit' />
              </div>
            </div>
          </form>
        </div>
      </div>
      }

      {modalUpdateVisible &&
      <div className="modall">
        <div className="modall-content">
          <span className="close" onClick={toggleUpdateVisibility} >&times;</span>
          <h4>Edit Zone</h4>
          <form onSubmit={handleZoneUpdate}>
            <div className="row">
              <div className="col-md-4 pr-md-1">
                <div className="form-group">
                  <label>Zone ID</label>
                  <input className="form-control" 
                        type="number" 
                        value={zoneId} 
                        onChange={e => setZoneId(e.target.value)} 
                        placeholder='Zone Id'
                        disabled/>
                </div>
              </div>
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                <label>Zone Name</label>
                  <input className="form-control" 
                          type="text" 
                          value={zoneName} 
                          onChange={e => setZoneName(e.target.value)} 
                          placeholder='Zone Name'
                          required/>
                </div>
              </div>
              <div className="col-md-4 pl-md-1">
                <div className="form-group">
                <label>Critical Level</label>
                  <select className="form-control" 
                    value={critical} onChange={e => setCritical(e.target.value)}
                    required>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4 pr-md-1">
                <div className="form-group">
                <label>Temperature Threshold</label>
                  <input className="form-control" 
                        type="number" 
                        value={thresholdTemp} 
                        onChange={e => setThresholdTemp(e.target.value)} 
                        placeholder='Temperature Threshold'
                        required/>
                </div>
              </div>
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                <label>Humidity Threshold</label>
                  <input className="form-control" 
                          type="number" 
                          value={thresholdHumidity} 
                          onChange={e => setThresholdHumidity(e.target.value)} 
                          placeholder='Humidity Threshold'
                          required/>
                </div>
              </div>
              <div className="col-md-4 pl-md-1">
                <div className="form-group">
                <label>Gas Threshold</label>
                  <input className="form-control" 
                          type="number" 
                          value={thresholdGas} 
                          onChange={e => setThresholdGas(e.target.value)} 
                          placeholder='Gas Threshold'
                          required/>
                </div>
              </div>
              
            </div>
          
            <div className="row">
              <div className="col-md-12 text-center">
                <input type='submit' className="btn btn-fill btn-info text-sm" value='Update' />
              </div>
            </div>
          </form>
        </div>
      </div>
      }
    </div>
    
  )
}

export default Zone
