import React, { useState, useEffect } from 'react';

const Node = () => {
  const [zoneData, setZoneData] = useState([]);
  const [nodeData, setNodeData] = useState([]);

  const [zoneId, setZoneId] = useState('');
  const [nodeId, setNodeId] = useState('');
  const [devEUI, setDevEUI] = useState('');
  const resetNodeState = () => {
    setZoneId(''); 
    setNodeId('');
    setDevEUI('');
  };

  // Node {
  //   zone_id
  //   node_id
  //   dev_eui
  //   created_on
  //   modified_on
  // }

  // Define state to control the visibility of the tag
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);

  // Function to toggle the visibility
  const toggleAddVisibility = () => {
      setModalAddVisible(!modalAddVisible);
  };
  
  // Update Modal Visibility function
  const toggleUpdateVisibility = (nodeId) => {
    if(!modalUpdateVisible){
      fetch(`https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/node?nodeId=${nodeId}`)
      .then((res) => res.json())
      .then(res => {
        // console.log('Response Zone:', res);
        if (res) {
          setZoneId(res.zone_id); 
          setNodeId(res.node_id);
          setDevEUI(res.dev_eui);
          setModalUpdateVisible(true);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch(error => console.error('Error fetching data:', error));

    }
    else{
      setModalUpdateVisible(false);
      resetNodeState();
    }
    
  };

  // GET /zones
  useEffect(() => {
    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/zones')
    .then((res) => res.json())
    .then(res => {
      if (res && Array.isArray(res.zones)) {
        // Map the data array to a new format
        const mappedData = res.zones.map(item => {
          return {
            zone_id: item.zone_id,
            zone_name: item.zone_name,
          };
        });
        setZoneData(mappedData);
      } else {
        throw new Error('Invalid response format');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
  },[]); 
  

  // GET /nodes
  useEffect(() => {
    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/nodes')
    .then((res) => res.json())
    .then(res => {
      if (res && Array.isArray(res.nodes)) {
        // Map the data array to a new format
        const mappedData = res.nodes.map(item => {
          return {
            zone_id: item.zone_id,
            node_id: item.node_id,
            dev_eui: item.dev_eui,
            created_on: item.created_on,
            modified_on: null,
          };
        });
        setNodeData(mappedData);
        
      } else {
        throw new Error('Invalid response format');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
  }); 

    
  // POST /node
  const handleNodeAdd = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const nodeData = {
      zone_id: parseInt(zoneId),
      node_id: parseInt(nodeId),
      dev_eui: devEUI,
      created_on: Date.now(),
      modified_on: null
    };

    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header for JSON data
        },
        body: JSON.stringify(nodeData), // Convert to JSON format
      })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Node has been added",
          showConfirmButton: false,
          timer: 1500
        });
        resetNodeState();
        toggleAddVisibility();
      } else {
        
        throw new Error('Failed to post node data');
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

  // PATCH /node
  const handleNodeUpdate = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    const nodeData = {
      node_id: parseInt(nodeId),
      zone_id: parseInt(zoneId),
      dev_eui: devEUI,
      modified_on: Date.now()
    };
    fetch('https://l8s7cnxgzi.execute-api.us-east-1.amazonaws.com/prod/node', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header for JSON data
        },
        body: JSON.stringify(nodeData), // Convert zoneData to JSON format
      })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Node has been updated",
          showConfirmButton: false,
          timer: 1500
        });
        resetNodeState();
        toggleUpdateVisibility();
      } else {
        
        throw new Error('Failed to update node data');
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
                <h4 className="card-title font-weight-bold"> Nodes List</h4>
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
                        Node ID
                      </th>
                      <th className="text-center">
                        Zone ID
                      </th>
                     
                      <th className="text-center">
                        Device EUI
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
                    nodeData.map((item) => (
                      <tr key={item.node_id}>
                      <td className="text-center">
                      {item.node_id}
                      </td>
                      <td className="text-center">
                      {item.zone_id}
                      </td>
                      
                      <td className="text-center">
                      {item.dev_eui}
                      </td>
                      <td className="text-center">
                        {new Date(item.created_on).toLocaleString() }
                      </td>
                      <td className="text-center">
                        <button className="btn" onClick={() =>toggleUpdateVisibility(item.node_id)}>Edit</button>
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
          <h4>Add Node</h4>
          <form onSubmit={handleNodeAdd}>
            <div className="row">
            <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <select className="form-control" 
                      value={zoneId} onChange={e => setZoneId(e.target.value)}
                      required>
                      <option value="" disabled>Zone</option>
                      {
                        zoneData.map((item) => (
                            <option key={item.zone_id} value={item.zone_id}>{item.zone_name}</option>
                        ))
                      }
                  </select>
                </div>
              </div>

              <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <input className="form-control" 
                          type="number" 
                          value={nodeId} 
                          onChange={e => setNodeId(e.target.value)} 
                          placeholder='Node ID'
                          required/>
                </div>
              </div>
              <div className="col-md-4 pl-md-1">
                <div className="form-group">
                <input className="form-control" 
                          type="text" 
                          value={devEUI} 
                          onChange={e => setDevEUI(e.target.value)} 
                          placeholder='Device EUI'
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
          <h4>Update Node</h4>
          <form onSubmit={handleNodeUpdate}>
            <div className="row">
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <input className="form-control" 
                          type="number" 
                          value={nodeId} 
                          onChange={e => setNodeId(e.target.value)} 
                          placeholder='Node ID'
                          required/>
                </div>
              </div>
              <div className="col-md-4 px-md-1">
                <div className="form-group">
                  <select className="form-control" 
                      value={zoneId} onChange={e => setZoneId(e.target.value)}
                      required>
                      <option value="" disabled>Zone</option>
                      {
                        zoneData.map((item) => (
                            <option key={item.zone_id} value={item.zone_id}>{item.zone_name}</option>
                        ))
                      }
                  </select>
                </div>
              </div>

             
              <div className="col-md-4 pl-md-1">
                <div className="form-group">
                <input className="form-control" 
                          type="text" 
                          value={devEUI} 
                          onChange={e => setDevEUI(e.target.value)} 
                          placeholder='Device EUI'
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

export default Node
