//
//  BeaconViewController.swift
//  jobcentre
//
//  Created by Anton McConville on 2016-09-15.
//  Copyright © 2016 Anton McConville. All rights reserved.
//

import UIKit

class BeaconViewController: UIViewController, ESTTriggerManagerDelegate {
    
   let triggerManager = ESTTriggerManager()

    override func viewDidLoad() {
        super.viewDidLoad()

   /*     var locationManager : CLLocationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.requestAlwaysAuthorization() */
        
        
        self.triggerManager.delegate = self
        // add this below:
        let rule1 = ESTProximityRule.inRangeOfNearableIdentifier("46ae7daf83e5e7e9")
        
        let trigger = ESTTrigger(rules: [rule1], identifier: "jobcenter")
        
        self.triggerManager.startMonitoring(for: trigger)
        
        self.triggerManager.delegate = self
        
        // Do any additional setup after loading the view.
    }

    
    func triggerManager(_ manager: ESTTriggerManager,
                        triggerChangedState trigger: ESTTrigger) {
        
        if (trigger.identifier == "jobcenter" && trigger.state == true) {
            let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertControllerStyle.alert)
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
