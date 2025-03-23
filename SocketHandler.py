def handle(data):

    print("this is the data we got: " + data["message"])
    return {"message": "Hello from server!"}
