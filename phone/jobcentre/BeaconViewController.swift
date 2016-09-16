//
//  BeaconViewController.swift
//  jobcentre
//
//  Created by Anton McConville on 2016-09-15.
//  Copyright © 2016 Anton McConville. All rights reserved.
//

import UIKit

class BeaconViewController: UIViewController, ESTTriggerManagerDelegate {
    
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    let triggerManager = ESTTriggerManager()

    override func viewDidLoad() {
        super.viewDidLoad()

   /*     var locationManager : CLLocationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.requestAlwaysAuthorization() */
    
        
        self.triggerManager.delegate = self

        let rule1 = ESTProximityRule.inRangeOfNearableIdentifier("46ae7daf83e5e7e9")
        
        let trigger = ESTTrigger(rules: [rule1], identifier: "jobcenter")
        
        self.triggerManager.startMonitoring(for: trigger)
        
        self.triggerManager.delegate = self
    }

    
    func triggerManager(_ manager: ESTTriggerManager,
                        triggerChangedState trigger: ESTTrigger) {
        
        if (trigger.identifier == "jobcenter" && trigger.state == true) {
            
            let target = "http://jobcentre.mybluemix.net/visit";
            
            let url:URL = URL(string: target)!
            let session = URLSession.shared
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.cachePolicy = NSURLRequest.CachePolicy.reloadIgnoringCacheData
            
            let paramString = "firstname=" + self.appDelegate.firstname + "&lastname=" + self.appDelegate.lastname + "&email=" + self.appDelegate.username;
            
            request.httpBody = paramString.data(using: String.Encoding.utf8)
            
            let task = session.dataTask(with: request as URLRequest) {
                
                (data, response, error) in
                
                guard let data = data, let _:URLResponse = response  , error == nil else {
                    print("error")
                    print(response)
                    return
                }
                
                let dataString = String(data: data, encoding: String.Encoding.utf8)
                
                print(dataString)
            }
            
            task.resume()
            
            let alert = UIAlertController(title: "Welcome to Astor Job Centre", message:self.appDelegate.firstname, preferredStyle: UIAlertControllerStyle.actionSheet)
            alert.addAction(UIAlertAction(title: "Click", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            
            
        } else {
            
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
