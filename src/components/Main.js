import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment';
import { Button } from 'react-bootstrap';


class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5 text-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
                <h2 className="text-white text-monospace bg-dark"><b><ins>Share Your Digital Asset</ins></b></h2>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const description = this.fileDescription.value
                    this.props.uploadFile(description)
                  }} >
                      <div className="form-group">
                        <br></br>
                          <input
                            id="fileDescription"
                            type="text"
                            ref={(input) => { this.fileDescription = input }}
                            className="form-control text-monospace my-3"
                            placeholder="description..."
                            required />
                      </div>
                    <input type="file" onChange={this.props.captureFile} className="text-white text-monospace my-3 py-3"/>
                    <button type="submit" className="btn-primary btn-block"><b>Upload!</b></button>
                  </form>
              </div>
              <p>&nbsp;</p>
              <table className="table-sm table-bordered text-monospace my-5" style={{ width: '1000px', maxHeight: '450px'}}>
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className="bg-dark text-white">
                    <th scope="col" style={{ width: '10px'}}>id</th>
                    <th scope="col" style={{ width: '100px'}}>name</th>
                    <th scope="col" style={{ width: '230px'}}>description</th>
                    <th scope="col" style={{ width: '120px'}}>type</th>
                    <th scope="col" style={{ width: '90px'}}>funds</th>
                    <th scope="col" style={{ width: '90px'}}>views</th>
                    <th scope="col" style={{ width: '90px'}}>date</th>
                    <th scope="col" style={{ width: '80px'}}>uploader</th>
                    <th scope="col" style={{ width: '520px'}}>Price</th>
                    <th scope="col" style={{ width: '520px'}}>hash/view/get</th>
                    <th scope="col" style={{ width: '560px'}}>Donate</th>
                    <th scope="col" style={{ width: '70px'}}>Actions</th>
                  </tr>
                </thead>
                { this.props.files.map((file, key) => {
                  return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{file.fileId}</td>
                        <td>{file.fileName}</td>
                        <td>{file.fileDescription}</td>
                        <td>{ file.fileType}</td>
                        <td>{ window.web3.utils.fromWei(file.funds.toString(),'Ether') } Eth</td>
                        <td>{ file.views }</td>
                        <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                        <td>
                        {
                          (file.uploader == file.owner)
                          ? <a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">Self Owned<br/>
                            {file.uploader.substring(0,10)}...
                          </a>
                          :<div><a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">Creator<br/>
                            {file.uploader.substring(0,10)}...
                          </a>
                          <a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target="_blank">Owner<br/>
                            {file.owner.substring(0,10)}...
                          </a>
                          </div>
                          
                        }
                          
                         </td>
                         <td>
                         View Price: { file.viewPrice*0.0001 } Eth
                         reDistribute Price: { file.viewPrice*0.005 } Eth
                         </td>
                        <td>
                        {

                            ((file.fileType).match(/^audio/g))

                              ?<Button size="lg" className="p-3" name = { file.fileId }
                                      value = { file.viewPrice }
                                      id = { file.fileHash }
                                      onClick = {(event) => {
                                        event.preventDefault()
                                            this.props.viewed(event.target.name,event.target.value,event.target.id)
                                      }} ><img style={{ width:'100%',height:'100%' }}
                                     src={ require('./visual.jpg') }
                                /></Button>
                              :((file.fileType).match(/^video/g)) 
                              ? <Button size="lg" className="p-3" name = { file.fileId }
                                      value = { file.viewPrice }
                                      id = { file.fileHash }
                                      onClick = {(ev) => {
                                        ev.preventDefault()
                                            this.props.viewed(ev.target.name,ev.target.value, ev.target.id)
                                      }} ><video style={{ width:'70%',height:'60%' }}>
                                      <source src={"https://ipfs.infura.io/ipfs/" + file.fileHash} type="video/mp4"/>
                               </video>
                               </Button>
                              : <Button size="lg" className="p-3" name = { file.fileId }
                                      value = { file.viewPrice }
                                      id = { file.fileHash }
                                      onClick = {(et) => {
                                        console.log(et.target.id)
                                           et.preventDefault()
                                            this.props.viewed(et.target.name,et.target.value, et.target.id)
                                      }} ><img className="px-0" style={{ width:'100%',height:'100%' }}
                            src={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                            /></Button>

                            
                            }
                          
                        
                        </td>
                        <td>
                          <form onSubmit={(e) => {
                            e.preventDefault()
                            const id = file.fileId
                            const price = window.web3.utils.toWei(this.price.value.toString(),'Ether');
                            this.props.donateFunds(id,price)
          }}
          >
                      <div className="form-group">
                        <br></br>
                          <input
                            id="price"
                            type="text"
                            ref = {(input) => { this.price = input}}                            
                            className="form-control text-monospace"
                            placeholder="Enter amount in eth"
                            />
                      </div>
                   
                    <button type="submit" className="btn-primary btn-block"><b>Donate</b></button>
                  </form>
                        </td>
                        
                        <td>
                        {
                          <Button name = { file.fileId }
                                      value = { file.viewPrice }
                                      onClick = {(et) => {
                                        
                                           et.preventDefault()
                                            this.props.onSell(et.target.name,et.target.value)
                                      }} >Buy Asset</Button>

                        }
                          {

                            
                            ((file.fileType).match(/^audio/g))

                              ?<button  name = { file.fileId }
                                      value = { file.viewPrice }
                                      
                                      onClick = {(et) => {
                                        console.log(et.target.id)
                                           et.preventDefault()
                                            this.props.reDistribute(et.target.name,et.target.value, et.target.id)
                                      }} >Remix</button>
                              :((file.fileType).match(/^video/g)) 
                              ? <button  name = { file.fileId }
                                      value = { file.viewPrice }
                                      id = { file.fileHash }
                                      onClick = {(et) => {
                                        console.log(et.target.id)
                                           et.preventDefault()
                                            this.props.reDistribute(et.target.name,et.target.value, et.target.id)
                                      }} > Clip </button>
                              : <button  name = { file.fileId }
                                      value = { file.viewPrice }
                                      id = { file.fileHash }
                                      onClick = {(et) => {
                                        console.log(et.target.id)
                                           et.preventDefault()
                                            this.props.reDistribute(et.target.name,et.target.value, et.target.id)
                                      }} >Download</button>

                            
                            }
                        
                          
                        </td>
                      </tr>
                    </thead>
                  )
                })}
              </table>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;