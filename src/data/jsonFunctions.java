package data;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import com.google.gson.Gson;
import com.fasterxml.jackson.databind.*;

import book.*;

public class jsonFunctions {
	public boolean updated = false;
	
	public static String toJson(ArrayList<book> books) {
		Gson gson = new Gson();
		String jsonArray = gson.toJson(books);
		System.out.println(jsonArray);
		return jsonArray;
	}
	
	public static void fileWriter(ArrayList<book> books) {
		ObjectMapper mapper = new ObjectMapper();
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		try {
			mapper.writeValue(new File("./src/main/webapp/data.json"), books);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
