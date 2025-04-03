import streamlit as st
import pandas as pd
import pickle
import folium
from streamlit_folium import folium_static
import networkx as nx

# Load the trained safety model
model_path = 'models/safety_model.pkl'
with open(model_path, 'rb') as file:
    model = pickle.load(file)

# Load the dataset for visualization and safety analysis
df = pd.read_csv('pune_safety_data.csv')  # Update with your actual dataset path

# Sidebar Inputs
st.sidebar.header("Input Parameters")
start_location = st.sidebar.text_input("Enter Starting Location")
end_location = st.sidebar.text_input("Enter Ending Location")

# Function to calculate the safest path using Dijkstra's Algorithm
def calculate_safest_path(start, end):
    # Create a graph from your safety data
    G = nx.Graph()
    
    # Add nodes and edges based on your dataset
    for index, row in df.iterrows():
        # Create nodes
        G.add_node(row['Location'], 
                   crime_rate=row['Crime Rate'],
                   accident_rate=row['Accident Rate'],
                   lighting_quality=row['Lighting Quality'])
        
        # Example of adding edges (assuming you have distance or travel time data)
        # Here you should adjust how you want to create edges based on your dataset
        if index < len(df) - 1:
            G.add_edge(row['Location'], df.iloc[index + 1]['Location'], weight=row['Accident Rate'] + row['Crime Rate'])

    # Find the safest path using Dijkstra's algorithm
    try:
        safest_path = nx.dijkstra_path(G, start, end)
        total_distance = sum(G[edge[0]][edge[1]]['weight'] for edge in zip(safest_path[:-1], safest_path[1:]))
        return safest_path, total_distance
    except nx.NetworkXNoPath:
        st.write("No path found between the specified locations.")
        return [], None

# Check if locations are entered
if start_location and end_location:
    safest_path, total_distance = calculate_safest_path(start_location, end_location)
    
    # Display results
    if safest_path:
        st.write(f"Safest path: {' -> '.join(safest_path)}")
        st.write(f"Total distance (safety factor): {total_distance}")

        # Create a map to visualize the path
        map_center = df[['Latitude', 'Longitude']].mean().values.tolist()  # Replace with your actual latitude/longitude columns
        m = folium.Map(location=map_center, zoom_start=12)

        # Add markers for start and end locations
        folium.Marker(location=df.loc[df['Location'] == start_location, ['Latitude', 'Longitude']].values[0].tolist(), 
                      popup=start_location, icon=folium.Icon(color='green')).add_to(m)
        folium.Marker(location=df.loc[df['Location'] == end_location, ['Latitude', 'Longitude']].values[0].tolist(), 
                      popup=end_location, icon=folium.Icon(color='red')).add_to(m)

        # Add path to the map
        for i in range(len(safest_path) - 1):
            start_coords = df.loc[df['Location'] == safest_path[i], ['Latitude', 'Longitude']].values[0].tolist()
            end_coords = df.loc[df['Location'] == safest_path[i + 1], ['Latitude', 'Longitude']].values[0].tolist()
            folium.PolyLine(locations=[start_coords, end_coords], color='blue', weight=5).add_to(m)

        folium_static(m)

    else:
        st.write("No valid safest path found.")
