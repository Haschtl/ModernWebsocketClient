from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import array
import numpy


class SimpleEcho(WebSocket):

    def handleMessage(self):
        # echo message back to client
        if self.data == "binary":
            empty_bytes = bytes(40)
            # self.sendMessage(array.array('B', [1] * 1000))
            self.sendMessage(empty_bytes)
        else:
            self.sendMessage(self.data)

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8000, SimpleEcho)
server.serveforever()