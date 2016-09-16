//
//  ViewController.swift
//  jobcentre
//
//  Created by Anton McConville on 2016-09-15.
//  Copyright © 2016 Anton McConville. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet var username : UITextField!
    
    @IBOutlet var password: UITextField!
    
    @IBAction func login(sender: UIButton) {
        // do something
        
        print("clicked the button");
        
        print(username.text);
        print(password.text);
        
        let target = "http://jobcentre.mybluemix.net/login";
        
      //  let target = "http://cloudco.mybluemix.net/login"
        
        let url:URL = URL(string: target)!
        let session = URLSession.shared
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.cachePolicy = NSURLRequest.CachePolicy.reloadIgnoringCacheData

        
        let paramString = "email=" + username.text! + "&password=" + password.text!;
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
        
        self.performSegue(withIdentifier: "beaconsegue", sender: nil)

        
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    
    func postLogin(){
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}

