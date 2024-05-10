import React, { useState, useEffect } from 'react';

const Drone = () => {
  const [droneData, setDroneData] = useState([]);

  const [droneId, setDroneId] = useState('');
  const [droneTopic, setDroneTopic] = useState('');
  const resetDroneState = () => {
    setDroneId(''); 
    setDroneTopic('');
  };

  // Define state to control the visibility of the tag
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);

  // Function to toggle the visibility
  const toggleAddVisibility = () => {
      setModalAddVisible(!modalAddVisible);
  };
  
  // Update Modal Visibility function
  const toggleUpdateVisibility = (droneId) => {
    if(!modalUpdateVisible){
      fetch(`https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/drone?droneId=${droneId}`)
      .then((res) => res.json())
      .then(res => {
        if (res) {
          setDroneId(res.drone_id); 
          setDroneTopic(res.mqtt_topic);
          setModalUpdateVisible(true);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => console.error('Error fetching data:', error));

    }
    else{
      setModalUpdateVisible(false);
      resetDroneState();
    }
    
  };

  // GET /drones
  useEffect(() => {
    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/drones')
    .then((res) => res.json())
    .then(res => {
      if (res && Array.isArray(res.drones)) {
        // Map the data array to a new format
        const mappedData = res.drones.map(item => {
          return {
            drone_id: item.drone_id,
            mqtt_topic: item.mqtt_topic,
            drone_status: item.drone_status,
            created_on: item.created_on
          };
        });
        setDroneData(mappedData);
      } else {
        throw new Error('Invalid response format');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
  },[]); 
  
   
  // POST /drone
  const handleDroneAdd = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const droneData = {
      drone_id: parseInt(droneId),
      mqtt_topic: droneTopic,
      drone_status: 'Available',
      created_on: Date.now(),
      modified_on: null
    };

    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/drone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header for JSON data
        },
        body: JSON.stringify(droneData), // Convert to JSON format
      })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Drone has been added",
          showConfirmButton: false,
          timer: 1500
        });
        resetDroneState();
        toggleAddVisibility();
      } else {
        
        throw new Error('Failed to post drone data');
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

  // PATCH /drone (update)
  const handleDroneUpdate = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const droneData = {
      drone_id: parseInt(droneId),
      mqtt_topic: droneTopic,
      modified_on: Date.now()
    };
    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/drone', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header for JSON data
        },
        body: JSON.stringify(droneData), // Convert zoneData to JSON format
      })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Drone has been updated",
          showConfirmButton: false,
          timer: 1500
        });
        resetDroneState();
        toggleUpdateVisibility();
      } else {
        
        throw new Error('Failed to update drone data');
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
                <h4 className="card-title font-weight-bold"> Drones List</h4>
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
                      <th className="text-center">
                        Drone ID
                      </th>
                      <th className="text-center">
                        MQTT Topic 
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
                    droneData.map((item) => (
                      <tr key={item.node_id}>
                      <td className="text-center">
                      {item.drone_id}
                      </td>
                      <td className="text-center">
                      {item.mqtt_topic}
                      </td>
                      
                      <td className="text-center">
                        <span className={item.drone_status == 'Available'? 'greenStatus' : 'redStatus'}>{item.drone_status}</span>
                      </td>
                      <td className="text-center">
                        {new Date(item.created_on).toLocaleString() }
                      </td>
                      <td className="text-center">
                        <button className="btn" onClick={() =>toggleUpdateVisibility(item.drone_id)}>Edit</button>
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
          <h4>Add Drone</h4>
          <form onSubmit={handleDroneAdd}>
            <div className="row">
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <input className="form-control" 
                          type="number" 
                          value={droneId} 
                          onChange={e => setDroneId(e.target.value)} 
                          placeholder='Drone ID'
                          required/>
                </div>
              </div>
              <div className="col-md-8 pl-md-1">
                <div className="form-group">
                <input className="form-control" 
                          type="text" 
                          value={droneTopic} 
                          onChange={e => setDroneTopic(e.target.value)} 
                          placeholder='MQTT Topic'
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
          <h4>Update Drone</h4>
          <form onSubmit={handleDroneUpdate}>
            <div className="row">
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <label>Drone ID</label>
                  <input className="form-control" 
                          type="number" 
                          value={droneId} 
                          onChange={e => setNodeId(e.target.value)} 
                          placeholder='Drone ID'
                          disabled/>
                </div>
              </div>
              <div className="col-md-8 pl-md-1">
                <div className="form-group">
                  <label>MQTT Topic</label>
                  <input className="form-control" 
                            type="text" 
                            value={droneTopic} 
                            onChange={e => setDroneTopic(e.target.value)} 
                            placeholder='MQTT Topic'
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

export default Drone
