
# Backend for SecureDove 
## CptS 428

### How to run the backend

    Make sure you have these installed
        Python3
        Node.js
        npm
    Create a virtual environment
        python -m venv myenv
        On Windows myenv/Scripts/activate
        On macOS and Linux source myenv/bin/activate
    Managing the virtual environment
        When you want to leave use deactivate
        Make sure to upgrade pip python -m pip install --upgrade pip
    Install packages from requirements.txt before running the SecureDove
        pip install -r requirements.txt

    To Run the SecureDove

        In 1st terminal navigate to the /SecureDove/frontend folder
            Use npm start
        In 2nd terminal navigate to the /SecureDove/backend folder
            Use uvicorn main:app --reload


    Use "uvicorn main:app --reload" to run. If done correctly you should see this in your terminal. 
    -------------------------------------------
    Terminal:/.../backend/uvicorn main:app --reload
    INFO:     Will watch for changes in these directories: ['/.../CptS428-ABFMJ-SecureDove/securedove/backend']
    INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
    INFO:     Started reloader process [13947] using StatReload
    Connection Success!
    INFO:     Started server process [13949]
    INFO:     Waiting for application startup.
    INFO:     Application startup complete.
    --------------------------------------------


    You can go to http://127.0.0.1:8000 to see the default screen of fastapi but if you go to http://127.0.0.1:8000/docs you can interact with all the endpoint as you are developing them.

    To interact with an endpoint on /docs click on the endpoint them click on "try it out" and enter in any input that is required or click execute if none is required. The result of that endpoint should be returned below. 







#### Sidenote for frontend I had to install 
`npm install react-router-dom`

