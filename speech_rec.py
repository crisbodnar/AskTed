import speech_recognition as sr

r = sr.Recognizer()
with sr.Microphone() as source:
    print("Say something!")
    audio = r.listen(source)
try:
    result = r.recognize_google(audio)
    print result
except sr.UnknownValueError:
    print "Nigel couldn't understand what you said."
f = open('./response.txt', 'w')
f.write(result)
f.close()
