### **Performance Testing of Booking System with JMeter**

# Introduction

This document explains how to run a performance test with JMeter against an booking system.

# Install

**Java**  
https://www.oracle.com/java/technologies/downloads/

**JMeter**  
https://jmeter.apache.org/download_jmeter.cgi  

Click =>Binaries    
=>**apache-jmeter-5.5.zip**

# Prerequisites
- As of JMeter 4.0, Java 8 and above are supported.
- we suggest  multicore cpus with 4 or more cores.
- Memory 16GB RAM is a good value.

# Elements of a minimal test plan
- Thread Group

    The root element of every test plan. Simulates the (concurrent) users and then run all requests.

- HTTP Request Default (Configuration Element)

- HTTP Request (Sampler)

- Summary Report (Listener)

# Test Plan

Testplan > Add > Threads (Users) > Thread Group (this might vary dependent on the jMeter version you are using)

- Name: Users
- Number of Threads (users): 1 to 600
- Ramp-Up Period (in seconds): 10
- Loop Count: 1  

  1) The general setting for the tests execution, such as whether Thread Groups will run simultaneously or sequentially, is specified in the item called Test Plan.

  2) All HTTP Requests will use some default settings from the HTTP Request, such as the Server IP, Port Number, and Content-Encoding.

  3) Each Thread Group specifies how the HTTP Requests should be carried out. To determine how many concurrent "users" will be simulated, one must first know the number of threads. The number of actions each "user" will perform is determined by the loop count.

  4) The HTTP Header Manager, which allows you to provide the Request Headers that will be utilized by the upcoming HTTP Requests, is the first item in Thread Groups.

## API Documentation:
- [https://documenter.getpostman.com/view/26561979/2sAY4uBNUt](https://restful-booker.herokuapp.com/apidoc/index.html?fbclid=IwY2xjawGccqJleHRuA2FlbQIxMAABHbeolDOAkKMUz5Pv2VmxZfxuO75Ud2oX5uGlYWzT9iZlhe_XC5GxYTosgg_aem_ghW_66gtcqWedH3HsILHoA#api-Booking-CreateBooking)

# Test execution (from the Terminal)
 
- JMeter should be initialized in non-GUI mode.
- Make a report folder in the **bin** folder.  
- Run Command in __jmeter\bin__ folder.

 ### Make jtl file    
 
   - **n**: non GUI mode
  - **t**: test plan to execute
  - **l**: output file with results


```bash
  jmeter -n -t booking_system_t600.jmx -l report\booking_system_t600.jtl
```      
  Then continue to upgrade Threads(1 to 600) by keeping Ramp-up Same. 

![image](https://github.com/user-attachments/assets/2f3473ca-0bd5-40d7-be5c-3e6a1c0d45d8)

After completing this command  
   ### Make html file   
  
  ```bash
  jmeter -g report\booking_system_t600.jtl -o report\booking_system_t600.html
```
 

  - **g**: jtl results file

  - **o**: path to output folder 

![image](https://github.com/user-attachments/assets/4733b85f-fc9a-4b01-8e36-ca9ea5b242b1)
![image](https://github.com/user-attachments/assets/b04af382-de52-4c86-b554-fe61cb45ebe9)

# HTML Report

**Number of Threads 500 ; Ramp-Up Period 10s**

Requests Summary             |  Errors
:-------------------------:|:-------------------------:
![image](https://github.com/user-attachments/assets/d68290b2-6b8a-42f2-a792-df486b237394)  |  ![image](https://github.com/user-attachments/assets/d52df2d0-d796-4b29-86a9-71d0bdd86e60)

**Number of Threads 550 ; Ramp-Up Period 10s**
   
Requests Summary             |  Errors
:-------------------------:|:-------------------------:
![image](https://github.com/user-attachments/assets/0de246e5-88d7-4d30-ad5b-954c6accdd07)  |  ![image](https://github.com/user-attachments/assets/ef069e66-5b79-4da5-8f89-e73f641ae4e8)

**Number of Threads 600 ; Ramp-Up Period 10s**
   
Requests Summary             |  Errors
:-------------------------:|:-------------------------:
![image](https://github.com/user-attachments/assets/c897683f-869e-4ffd-83bc-6eb560adaf73)  |  ![image](https://github.com/user-attachments/assets/504afcca-cdf7-4c53-86d8-b03d8a510e03)








