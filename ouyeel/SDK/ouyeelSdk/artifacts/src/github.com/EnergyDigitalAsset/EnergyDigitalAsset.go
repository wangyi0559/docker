
package main


import (
	"fmt"
	//"strconv"
    "encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("DigitalAsset")

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response  {
        return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### DigitalAsset Invoke ###########")

	function, args := stub.GetFunctionAndParameters()
	
	if function == "CreateDigitalAssets" {
		return t.CreateDigitalAssets(stub, args)
	}
        if function == "ChangeOwner" {
		return t.ChangeOwner(stub, args)
	}
	if function == "QueryDigitalAsset" {
		return t.QueryDigitalAsset(stub, args)
	}

	if function == "UpdateDigitalAsset" {
		return t.UpdateDigitalAsset(stub, args)
	}
	if function == "DeleteDigitalAsset" {
		return t.DeleteDigitalAsset(stub, args)
	}
	logger.Errorf("Unknown action, check the first argument, must be one of 'CreateDigitalAssets', 'ChangeOwner', 'UpdateDigitalAsset', 'DeleteDigitalAsset', or 'QueryDigitalAsset'. But got: %v", args[0])
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'CreateDigitalAssets', 'ChangeOwner', 'UpdateDigitalAsset', 'DeleteDigitalAsset', or 'QueryDigitalAsset'. But got: %v", args[0]))
}



//====================================================================================
//产能数字资产结构体
//每一份数字资产对应一个产能号 EnergyID
//====================================================================================
type DigitalAsset struct {
    OwnerID            string `json:"ownerID"`               // the owner of assets
    Type               string `json:"type"`                  
    Deadline           string `json:"Deadline"`              //产品交付截止时间
    Quantity           string `json:"quantity"`         
    TotalPrice         string `json:"totalprice"`            //预估价
}

//============================================================================================================
//根据产能信息创建数字资产
//args: 产能ID|拥有者ID|类型|交付截止时间|预计产量|总价
//============================================================================================================
func (t *SimpleChaincode) CreateDigitalAssets (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("CreateDigitalAssets")

	if len(args) != 6 {
	    return shim.Error("Incorrect number of arguments. Expecting 6")
	}
    
	EnergyID := args[0]
	var digitalAsset DigitalAsset                  //create a digital asset struct consisting of all properties
	digitalAsset.OwnerID = args[1]
	digitalAsset.Type = args[2]
	digitalAsset.Deadline = args[3]
	digitalAsset.Quantity = args[4]
	digitalAsset.TotalPrice = args[5]
   
    DigitalAssetBytes, _ := json.Marshal(digitalAsset)                  //把结构体转变为[]byte            
	
	// ==== Check if digital asset already exists ====
	bytes, err := stub.GetState(EnergyID)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	} 
	if bytes != nil {
		return shim.Error("This digital asset already exists: " + EnergyID)
    }
	
	//create digital asset
	err = stub.PutState(EnergyID, DigitalAssetBytes)
	if err != nil {
		return shim.Error(err.Error())
        }
	
	return shim.Success([]byte("资产创建成功"))
	
}

//======================================================================================================
//更改拥有者ID
// args: 产能ID|新拥有者ID
//======================================================================================================
func (t *SimpleChaincode) ChangeOwner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("ChangeOwner")
	
	if len(args) != 2 {
	    return shim.Error("Incorrect number of arguments. Expecting 2")
	}
    
	EnergyID := args[0]
	newOwnerID := args[1]
    var err error
	
	DigitalAssetBytes, _ := stub.GetState(EnergyID)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	} 
	if DigitalAssetBytes == nil {
		return shim.Error("This digital asset does not exists: " + EnergyID)
    }
	var digitalAsset DigitalAsset
	
	err = json.Unmarshal(DigitalAssetBytes, &digitalAsset)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	digitalAsset.OwnerID = newOwnerID
	
    DigitalAssetBytes, _ = json.Marshal(digitalAsset)
	err = stub.PutState(EnergyID, DigitalAssetBytes)
    if err != nil {
		return shim.Error(err.Error())
    }
	
	return shim.Success([]byte("更改成功"))

}

//==============================================================================
// 查询资产是否存在以及具体信息
// args: 产能ID
//==============================================================================
func (t *SimpleChaincode) QueryDigitalAsset(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	EnergyID := args[0]

	// Get the state from the ledger
	bytes, err := stub.GetState(EnergyID)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + EnergyID + "\"}"
		return shim.Error(jsonResp)
	}

	if bytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + EnergyID + "\"}"
		return shim.Error(jsonResp)
	}
    
	
	return shim.Success(bytes)
}

//================================================================================================================
//更新资产信息
//args: 产能ID|拥有者ID|类型|交付截止时间|预计产量|总价
//================================================================================================================
func (t *SimpleChaincode) UpdateDigitalAsset (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("UpdateDigitalAsset")
	
	if len(args) != 6 {
	    return shim.Error("Incorrect number of arguments. Expecting 6")
	}
	
	EnergyID := args[0]
	bytes, err := stub.GetState(EnergyID)
    if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	} 
	if bytes == nil {
		return shim.Error("This digital asset does not exists: " + EnergyID)
    }

	var digitalAsset DigitalAsset
	
	var NewdigitalAsset DigitalAsset
	                                                      //create a digital asset struct consisting of all properties
	 NewdigitalAsset.OwnerID = args[1]
	 NewdigitalAsset.Type = args[2]
	 NewdigitalAsset.Deadline = args[3]
	 NewdigitalAsset.Quantity = args[4]
	 NewdigitalAsset.TotalPrice = args[5]
	
	//update the properties
	json.Unmarshal(bytes, &digitalAsset)
	digitalAsset = NewdigitalAsset                      //update???
	bytes, err = json.Marshal(digitalAsset)
	if err != nil {
		return shim.Error( err.Error())
	}
	
	err = stub.PutState(EnergyID, bytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	
	return shim.Success([]byte("更改成功"))
	
}

//=============================================================================================
//删除数字资产
//args: 产能ID
//=============================================================================================
func (t *SimpleChaincode) DeleteDigitalAsset (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("DeleteDigitalAssets")
	
	if len(args) != 1 {
	    return shim.Error("Incorrect number of arguments. Expecting 1")
	}
    
	EnergyID := args[0]
    bytes, err := stub.GetState(EnergyID)
    if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	var digitalAsset DigitalAsset
	json.Unmarshal(bytes, &digitalAsset)
	digitalAsset = DigitalAsset{}                        //delete the struct
	bytes, err = json.Marshal(digitalAsset)
	if err != nil {
		return shim.Error( err.Error())
	}
	err = stub.PutState(EnergyID, bytes)       
	
	err = stub.DelState(EnergyID)
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
    }
    bytes, err = stub.GetState(EnergyID)
    if err != nil {
		return shim.Error("digital asset has been deleted ")
	} 
     
	return shim.Success([]byte("删除成功"))
}



//=======================================================================================
//main function 
//=================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
